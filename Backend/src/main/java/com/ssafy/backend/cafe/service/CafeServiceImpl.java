package com.ssafy.backend.cafe.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.LocationDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.dto.SelectCafeRequestDto;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import com.ssafy.backend.cafe.domain.enums.Direction;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.cafe.util.GeometryUtil;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Blob;
import java.util.*;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeServiceImpl implements CafeService {

    private final EntityManager em;
    private final CafeRepository cafeRepository;
    private final JwtUtil jwtUtil;
    private final MemberService memberService;
    private final CafeAuthRepository cafeAuthRepository;


    @Override
    public void checkCafeAuth() throws Exception {
        // 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname

        // 레디스에 인증정보가 없다면
        if (cafeAuthOptional.isEmpty()) {
            throw new Exception("401, 위치 인증 만료 상태");
        }

        // 존재한다면 삭제후 갱신
        long cafeId = cafeAuthOptional.get().getCafeId();
        cafeAuthRepository.deleteById(nickname);

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(600) // 600초
                .build();

        cafeAuthRepository.save(cafeAuth);
    }

    @Override
    public void saveCafeAuth(SelectCafeRequestDto selectCafeRequestDto) throws Exception {
        // 현 위치와 cafeId가 정말로 일치하는지 먼저 체크
        List<NearByCafeResultDto> nearByCafeLocations
                = this.getNearByCafeLocations(new ClientPosInfoDto(selectCafeRequestDto.getLatitude(),
                selectCafeRequestDto.getLongitude(), 0.05));

        ArrayList<Long> cafeIdLstForValid = new ArrayList<>();
        for (NearByCafeResultDto nearByCafeLocation : nearByCafeLocations) {
            cafeIdLstForValid.add(nearByCafeLocation.getId().longValue()); // 가져온 cafe id 넣기
        }

        if (!cafeIdLstForValid.contains(selectCafeRequestDto.getCafeId())) {
            throw new Exception("400 Bad -> 해킹시도");
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
            throw new Exception("레디스 저장 실패");
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


}
