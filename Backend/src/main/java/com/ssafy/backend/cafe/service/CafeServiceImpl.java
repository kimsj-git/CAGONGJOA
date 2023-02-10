package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.dto.*;
import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.domain.enums.CrowdLevel;
import com.ssafy.backend.cafe.domain.enums.Direction;
import com.ssafy.backend.cafe.repository.CafeCrowdRepository;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.cafe.util.GeometryUtil;
import com.ssafy.backend.common.exception.cafe.CafeException;
import com.ssafy.backend.common.exception.cafe.CafeExceptionType;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import javax.persistence.EntityManager;
import javax.persistence.Query;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeServiceImpl implements CafeService {

    private final EntityManager em;
    private final MemberService memberService;
    private final CafeAuthRepository cafeAuthRepository;
    private final CafeRepository cafeRepository;
    private final MemberRepository memberRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final PostUtil postUtil;
    private final CafeCrowdRepository cafeCrowdRepository;
    private final int THREE_HOURS_AGO = 3;


    @Override
    public List<NearByCafeWithCrowdResultDto> addCrowdInfoToNearByCafes(List<NearByCafeResultDto> nearByCafeLocations,
                                                                        CurTimeReqDto curTimeReqDto) {

        List<NearByCafeWithCrowdResultDto> nearByCafeWithCrowdResultDtos = new ArrayList<>();

        // 1. foreach로 가져온 카페들 순회
        for (NearByCafeResultDto nearByCafeLocation : nearByCafeLocations) {
            // 2.특정 카페 & 현재로부터 세시간에 해당하는 혼잡도 데이터 가져오기
            long id = nearByCafeLocation.getId().longValue();
            LocalDateTime todayTime = curTimeReqDto.getTodayTime();

            LocalDateTime threeHoursAgo = todayTime.minusHours(THREE_HOURS_AGO);
            // 특정 카페에 대해 세시간 혼잡도 데이터 가져오기
            List<CafeCrowd> crowdList = cafeCrowdRepository
                    .findAllByCreatedAtBetweenAndCafeId(threeHoursAgo, todayTime, id);

            CrowdLevel crowdLevel = calcCrowdLevel(crowdList, todayTime);

            NearByCafeWithCrowdResultDto nearByCafeWithCrowdResultDto = new NearByCafeWithCrowdResultDto();
            nearByCafeWithCrowdResultDto.setCrowdLevel(crowdLevel);

            // 혼잡도 포함 dto에 기존 카페 dto 복사
            BeanUtils.copyProperties(nearByCafeLocation, nearByCafeWithCrowdResultDto);
            nearByCafeWithCrowdResultDtos.add(nearByCafeWithCrowdResultDto);
        }
        return nearByCafeWithCrowdResultDtos;
    }

    /**
     *  시간마다 가중치 다르게
     *  ~ 10분 - * 2
     *  ~ 30분 - * 1
     *  ~ 2시간 - * 0.7
     *  ~ 3시간 - * 0.5
     */
    private CrowdLevel calcCrowdLevel(List<CafeCrowd> crowdList, LocalDateTime todayTime) {

        int lstSize = crowdList.size();
        double totalCrowdVal = 0.0;

        for (CafeCrowd cafeCrowd : crowdList) {
            int crowdValue = cafeCrowd.getCrowdValue();
            Duration duration = Duration.between(cafeCrowd.getCreatedAt(), todayTime);
            int minutes = (int) duration.toMinutes();

            if (minutes <= 10) {
                totalCrowdVal += crowdValue * 2; // ~ 10분 2배
            } else if (minutes <= 30) {
                totalCrowdVal += crowdValue; // ~ 30분 1배
            } else if (minutes <= 120) {
                totalCrowdVal += crowdValue * 0.6; // ~ 120분 0.7배
            } else {
                totalCrowdVal += crowdValue * 0.3; // ~ 180분 0.5배
            }
        }
        double meanVal = totalCrowdVal / lstSize;

        // 첫째자리에서 반올림 코드
        double roundedMeanVal = (double) Math.round(meanVal * 10) / 10;

        if (roundedMeanVal < 2) {
            return CrowdLevel.L;
        } else if (roundedMeanVal < 3) {
            return CrowdLevel.M;
        } else {
            return CrowdLevel.H;
        }
    }

    @Override
    public void checkCafeAuth() {
        // 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname

        // 레디스에 인증정보가 없다면
        if (cafeAuthOptional.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_EXPIRED);
        }

        // 존재한다면 삭제후 갱신
        long cafeId = cafeAuthOptional.get().getCafeId();
        System.out.println("cafeId = " + cafeId);
        System.out.println("nickname = " + nickname);

        cafeAuthRepository.deleteById(nickname);

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(600) // 600초
                .build();

        cafeAuthRepository.save(cafeAuth);
    }



    @Override
    public void saveCafeAuth(SelectCafeRequestDto selectCafeRequestDto) {
        // 현 위치와 cafeId가 정말로 일치하는지 먼저 체크
        List<NearByCafeResultDto> nearByCafeLocations
                = this.getNearByCafeLocations(new ClientPosInfoDto(selectCafeRequestDto.getLatitude(),
                selectCafeRequestDto.getLongitude(), 1.0)); // 테스트용

        ArrayList<Long> cafeIdLstForValid = new ArrayList<>();
        for (NearByCafeResultDto nearByCafeLocation : nearByCafeLocations) {
            cafeIdLstForValid.add(nearByCafeLocation.getId().longValue()); // 가져온 cafe id 넣기
        }

        if (!cafeIdLstForValid.contains(selectCafeRequestDto.getCafeId())) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_MISMATCH);
        }

        // 현 위치와 cafe ID가 정말로 일치한다면
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        CafeAuth cafeAuth = CafeAuth.builder()
                                .cafeId(selectCafeRequestDto.getCafeId())
                                .nickname(nickname)
                                .expiration(600) // 600초
                                .build();

        cafeAuthRepository.save(cafeAuth);

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname

        if (cafeAuthOptional.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_SAVE_FAIL);
        }

    }


    @Transactional(readOnly = true)
    public List<NearByCafeResultDto> getNearByCafeLocations(ClientPosInfoDto clientPosInfoDto) {
        Double latitude = clientPosInfoDto.getLatitude();
        Double longitude = clientPosInfoDto.getLongitude();
        Double distance = clientPosInfoDto.getDist();

        System.out.println("distance = " + distance);
        System.out.println("longitude = " + longitude);
        System.out.println("latitude = " + latitude);

        LocationDto northEast = GeometryUtil
                .calculate(latitude, longitude, distance, Direction.NORTHEAST.getBearing());
        LocationDto southWest = GeometryUtil
                .calculate(latitude, longitude, distance, Direction.SOUTHWEST.getBearing());

        double x1 = northEast.getLatitude();
        double y1 = northEast.getLongitude();
        double x2 = southWest.getLatitude();
        double y2 = southWest.getLongitude();

        String pointFormat = String.format("'LINESTRING(%f %f, %f %f)')", x1, y1, x2, y2);

        Query query
                = em.createNativeQuery(
            "SELECT cf.id, cf.name, cl.address, cl.lat, cl.lng, cf.brand_type "
                    + "FROM (SELECT * "
                            + "FROM cafe_location AS c "
                            + "WHERE MBRContains(ST_LINESTRINGFROMTEXT(" + pointFormat + ", c.point) = 1) AS cl "
                    + "INNER JOIN cafe cf ON cf.id = cl.cafe_id");

        List<Object[]> results = query.getResultList();

        List<NearByCafeResultDto> nearByCafeResultDtos = new ArrayList<>();

        for (Object[] result : results) {
            NearByCafeResultDto dto = NearByCafeResultDto.builder()
                    .id((BigInteger) result[0])
                    .name((String) result[1])
                    .address((String) result[2])
                    .latitude((BigDecimal)result[3])
                    .longitude((BigDecimal)result[4])
                    .brand_type((String) result[5]).build();
            nearByCafeResultDtos.add(dto);
        }

        return nearByCafeResultDtos;
    }

    @Override
    public void saveTier() throws Exception {
        String nickname = postUtil.checkMember().getNickname();
        Long memberId = postUtil.checkMember().getMemberId();
        System.out.println(memberId + " " + nickname);
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        System.out.println(cafeAuth);
        Long cafeId = cafeAuth.getCafeId();
        Optional<MemberCafeTier> optionalMemberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(memberId, cafeId);
        
        // 없을 때만 넣기
        MemberCafeTier memberCafeTier;
        if(optionalMemberCafeTier.isEmpty() || optionalMemberCafeTier == null) {
            memberCafeTier  = MemberCafeTier.TierBuilder()
                    .cafe(cafeRepository.findById(cafeId).get())
                    .member(memberRepository.findById(memberId).get())
                    .exp(100L)
                    .build();
            memberCafeTierRepository.save(memberCafeTier);
        }
    }
}
