package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.dto.*;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.domain.enums.CrowdLevel;
import com.ssafy.backend.cafe.domain.enums.Direction;
import com.ssafy.backend.cafe.repository.CafeCrowdRepository;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.cafe.util.GeometryUtil;
import com.ssafy.backend.common.exception.cafe.CafeException;
import com.ssafy.backend.common.exception.cafe.CafeExceptionType;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
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
    private final CafeVisitLogRepository cafeVisitLogRepository;


    @Override
    public void saveCrowdLevel(CrowdCheckReqDto crowdCheckReqDto) {
        // 닉네임 가져오기
        MemberIdAndNicknameDto memberIdAndNick = memberService.getMemberIdAndNicknameByJwtToken();
        long memberId = memberIdAndNick.getId();
        String nickname = memberIdAndNick.getNickname();

        // 레디스 체크 - 위치인증 확인 및 카페 id 가져오기
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname
        if (cafeAuthOptional.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_EXPIRED);
        }

        long cafeId = cafeAuthOptional.get().getCafeId();

        // 오늘의 카페 정보 가져오기
        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository
                .findByVisitedAtAndMemberIdAndCafeId(crowdCheckReqDto.getTodayDate(), memberId, cafeId);

        if (optionalCafeVisitLog.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_MISMATCH);
        }

        if (optionalCafeVisitLog.get().isSurvey()) {
            throw new CafeException(CafeExceptionType.ALREADY_SUBMIT_CROWD_SURVEY);
        }

        optionalCafeVisitLog.get().setSurvey(true);

        // 혼잡도 설문 저장
        Optional<Cafe> optionalCafe = cafeRepository.findById(cafeId);
        if (optionalCafe.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_NOT_EXIST);
        }

        CafeCrowd cafeCrowd = CafeCrowd.cafeCrowdSaveBuilder()
                .cafe(optionalCafe.get())
                .crowdValue(crowdCheckReqDto.getCrowdLevel())
                .build();
        cafeCrowdRepository.save(cafeCrowd);
    }

    @Override
    public boolean checkCrowdSurvey(int todayDate) {
        // 닉네임 가져오기
        MemberIdAndNicknameDto memberIdAndNick = memberService.getMemberIdAndNicknameByJwtToken();
        long memberId = memberIdAndNick.getId();
        String nickname = memberIdAndNick.getNickname();

        // 레디스 체크 - 위치인증 확인 및 카페 id 가져오기
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname
        if (cafeAuthOptional.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_EXPIRED);
        }

        long cafeId = cafeAuthOptional.get().getCafeId();

        // 오늘의 카페 정보 가져오기
        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository
                .findByVisitedAtAndMemberIdAndCafeId(todayDate, memberId, cafeId);

        if (optionalCafeVisitLog.isEmpty()) {
            throw new CafeException(CafeExceptionType.CAFE_AUTH_MISMATCH);
        }

        return optionalCafeVisitLog.get().isSurvey();
    }

    @Override
    public List<NearByCafeWithCrowdResultDto> addCrowdInfoToNearByCafes(List<NearByCafeResultDto> nearByCafeLocations,
                                                                        CurTimeReqDto curTimeReqDto) {

        // 리턴할 리스트 선언
        List<NearByCafeWithCrowdResultDto> nearByCafeWithCrowdResultDtos = new ArrayList<>();

        // 근처 카페 위치정보 리스트
        List<Long> cafeIdList = new ArrayList<>();

        for (NearByCafeResultDto nearByCafeLocation : nearByCafeLocations) {
            cafeIdList.add(nearByCafeLocation.getId().longValue());
        }

        LocalDateTime todayTime = curTimeReqDto.getTodayTime();
        LocalDateTime threeHoursAgo = todayTime.minusHours(THREE_HOURS_AGO);

        List<CafeCrowd> cafeCrowds = cafeCrowdRepository.fineByCafeIds(cafeIdList, threeHoursAgo, todayTime);

        ArrayList<Long> curCafeIds = new ArrayList<>();

        for (CafeCrowd cafeCrowd : cafeCrowds) {
            curCafeIds.add(cafeCrowd.getCafe().getId());
        }

        List<Long> distinctCurCafeIds = curCafeIds.stream().distinct().collect(Collectors.toList());

        // [ {cafeID: [(time, value), (time, value), ...]}, {}, ... {}]
        Map<Long, ArrayList<TimeCrowdDto>> cafeCrowdMap = new HashMap();

        // map 초기화
        for (Long distinctCurCafeId : distinctCurCafeIds) {
            cafeCrowdMap.put(distinctCurCafeId, new ArrayList<TimeCrowdDto>());
        }

        // map에 값 채우기
        for (CafeCrowd cafeCrowd : cafeCrowds) {
            long curCafeId = cafeCrowd.getCafe().getId();
            cafeCrowdMap.get(curCafeId).add(new TimeCrowdDto(cafeCrowd.getCreatedAt(), cafeCrowd.getCrowdValue()));
        }

        // {cafeId : "L"}, {cafeId2 : "M"}, {cafeId3 : "H"} ...
        Map<Long, CrowdLevel> cafeIdsWithCrowdMap = calcCrowdLevel(cafeCrowdMap, todayTime);

        for (NearByCafeResultDto nearByCafeLocation : nearByCafeLocations) {

            NearByCafeWithCrowdResultDto nearByCafeWithCrowdResultDto = new NearByCafeWithCrowdResultDto();
            nearByCafeWithCrowdResultDto.setCrowdLevel(cafeIdsWithCrowdMap.get(nearByCafeLocation.getId().longValue()));

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
    private Map<Long, CrowdLevel> calcCrowdLevel(Map<Long, ArrayList<TimeCrowdDto>> cafeCrowdMap,
                                                 LocalDateTime todayTime) {

        // {cafeId : "L"}, {cafeId2 : "M"}, {cafeId3 : "H"} ...
        Map<Long, CrowdLevel> results = new HashMap<>();

        for (Long cafeId : cafeCrowdMap.keySet()) {
            ArrayList<TimeCrowdDto> timeCrowdDtos = cafeCrowdMap.get(cafeId);
            int crowdListSize = timeCrowdDtos.size();
            double sumCrowdVal = 0.0;


            for (TimeCrowdDto timeCrowdDto : timeCrowdDtos) {
                int crowdValue = timeCrowdDto.getVal();

                Duration duration = Duration.between(timeCrowdDto.getTime(), todayTime);
                int minutes = (int) duration.toMinutes();

                if (minutes <= 10) {
                    sumCrowdVal += crowdValue * 2; // ~ 10분 2배
                } else if (minutes <= 30) {
                    sumCrowdVal += crowdValue; // ~ 30분 1배
                } else if (minutes <= 120) {
                    sumCrowdVal += crowdValue * 0.6; // ~ 120분 0.7배
                } else {
                    sumCrowdVal += crowdValue * 0.3; // ~ 180분 0.5배
                }
            }

            double meanVal = sumCrowdVal / crowdListSize;

            // 첫째자리에서 반올림 코드
            double roundedMeanVal = (double) Math.round(meanVal * 10) / 10;

//            System.out.println("roundedMeanVal = " + roundedMeanVal + "cafeId = " +cafeId);

            if (roundedMeanVal < 2) {
                results.put(cafeId, CrowdLevel.L);
            } else if (roundedMeanVal < 3) {
                results.put(cafeId, CrowdLevel.M);
            } else {
                results.put(cafeId, CrowdLevel.H);
            }
        }
        return results;
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
