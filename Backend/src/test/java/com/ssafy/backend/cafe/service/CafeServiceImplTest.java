package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.dto.CafeSurveyRespDto;
import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import com.ssafy.backend.cafe.repository.CafeCrowdRepository;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.common.exception.cafe.CafeException;
import com.ssafy.backend.common.exception.cafe.CafeExceptionType;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import com.ssafy.backend.todaycafe.domain.entity.Survey;
import com.ssafy.backend.todaycafe.repository.SurveyRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigInteger;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CafeServiceImplTest {

    @Autowired
    CafeAuthRepository cafeAuthRepository;

    @Autowired
    CafeCrowdRepository cafeCrowdRepository;

    @Autowired
    SurveyRepository surveyRepository;


    @Test
    void 한글닉네임_위치인증_레디스조회() {
        // 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        String nickname = "양준모";
        long cafeId = 100;

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(600) // 600초
                .build();

        cafeAuthRepository.save(cafeAuth); // 인증된 상태 세팅

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname
        System.out.println("cafeAuthOptional.get() = " + cafeAuthOptional.get());
        assertThat(cafeAuthOptional.isEmpty()).isFalse();

        String getNickname = cafeAuthOptional.get().getNickname();
        System.out.println("getNickname = " + getNickname);
        long getCafeId = cafeAuthOptional.get().getCafeId();
        System.out.println("getCafeId = " + getCafeId);
    }


    @Test
    void 만족도설문_결과제공() {

        long cafeId = 1;

        // 해당 카페의 설문을 현재 날짜로 부터 2달 전 데이터 가져오기
        LocalDateTime todayTime = LocalDateTime.now();
        LocalDateTime twoMonthAgo = todayTime.minusMonths(2);
        List<Survey> surveys = surveyRepository.findByCafeIdsAndTimeRange(cafeId, twoMonthAgo, todayTime);
        System.out.println("surveys = " + surveys);


        /**
         * 설문조사 빈도 데이터를 map으로 저장
         * "power": [3, 4, 1] <- G,N,B 순
         */
        Map<String, ArrayList<Integer>> gnbCntMap = new HashMap<>();
        gnbCntMap.put("power", new ArrayList<>(Collections.nCopies(3, 0)));
        gnbCntMap.put("wifi", new ArrayList<>(Collections.nCopies(3, 0)));
        gnbCntMap.put("toilet", new ArrayList<>(Collections.nCopies(3, 0)));
        gnbCntMap.put("time", new ArrayList<>(Collections.nCopies(2, 0)));

        System.out.println(gnbCntMap.get("power"));

        // surveys 내용 빈도수 뽑아내서 resp dto 내용 채우기
        for (Survey survey : surveys) {
            if (survey.getReplyPower().equals("G")) {
                int curVal = gnbCntMap.get("power").get(0);
                gnbCntMap.get("power").set(0, curVal + 1);

            } else if (survey.getReplyPower().equals("N")) {
                int curVal = gnbCntMap.get("power").get(1);
                gnbCntMap.get("power").set(1, curVal + 1);

            } else if (survey.getReplyPower().equals("B")) {
                int curVal = gnbCntMap.get("power").get(2);
                gnbCntMap.get("power").set(2, curVal + 1);
            }

            if (survey.getReplyWifi().equals("G")) {
                int curVal = gnbCntMap.get("wifi").get(0);
                gnbCntMap.get("wifi").set(0, curVal + 1);

            } else if (survey.getReplyWifi().equals("N")) {
                int curVal = gnbCntMap.get("wifi").get(1);
                gnbCntMap.get("wifi").set(1, curVal + 1);

            } else if (survey.getReplyWifi().equals("B")) {
                int curVal = gnbCntMap.get("wifi").get(2);
                gnbCntMap.get("wifi").set(2, curVal + 1);
            }

            if (survey.getReplyToilet().equals("G")) {
                int curVal = gnbCntMap.get("toilet").get(0);
                gnbCntMap.get("toilet").set(0, curVal + 1);

            } else if (survey.getReplyToilet().equals("N")) {
                int curVal = gnbCntMap.get("toilet").get(1);
                gnbCntMap.get("toilet").set(1, curVal + 1);

            } else if (survey.getReplyToilet().equals("B")) {
                int curVal = gnbCntMap.get("toilet").get(2);
                gnbCntMap.get("toilet").set(2, curVal + 1);
            }

            if (survey.isReplyTime()) {
                int curVal = gnbCntMap.get("time").get(0);
                gnbCntMap.get("time").set(0, curVal + 1); // 0번 = 이용시간 제한 있음
            } else {
                int curVal = gnbCntMap.get("time").get(1);
                gnbCntMap.get("time").set(1, curVal + 1); // 1번 = 이용시간 제한 없음
            }
        }

        CafeSurveyRespDto cafeSurveyRespDto = new CafeSurveyRespDto();

        cafeSurveyRespDto.setReplyPower_high(gnbCntMap.get("power").get(0));
        cafeSurveyRespDto.setReplyPower_mid(gnbCntMap.get("power").get(1));
        cafeSurveyRespDto.setReplyPower_low(gnbCntMap.get("power").get(2));

        cafeSurveyRespDto.setReplyWifi_high(gnbCntMap.get("wifi").get(0));
        cafeSurveyRespDto.setReplyWifi_mid(gnbCntMap.get("wifi").get(1));
        cafeSurveyRespDto.setReplyWifi_low(gnbCntMap.get("wifi").get(2));

        cafeSurveyRespDto.setReplyToilet_high(gnbCntMap.get("toilet").get(0));
        cafeSurveyRespDto.setReplyToilet_mid(gnbCntMap.get("toilet").get(1));
        cafeSurveyRespDto.setReplyToilet_low(gnbCntMap.get("toilet").get(2));

        if (gnbCntMap.get("time").get(0) >= gnbCntMap.get("time").get(1)) {
            // 이용시간 제한 있음
            cafeSurveyRespDto.setReplyTime(true);
        } else {
            // 이용시간 제한 없음
            cafeSurveyRespDto.setReplyTime(false);
        }

        System.out.println("cafeSurveyRespDto = " + cafeSurveyRespDto);
    }

    @Test
    void 시간뺄셈() {
        LocalDateTime start = LocalDateTime.of(2022, Month.JANUARY, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2022, Month.JANUARY, 1, 12, 30);

        Duration duration = Duration.between(start, end);
        long minutes = duration.toMinutes();
        System.out.println("minutes = " + minutes);

        Duration duration2 = Duration.between(end, start);
        long minutes2 = duration2.toMinutes();
        System.out.println("minutes = " + minutes2);
    }

    @Test
    @Transactional
    void 특정_시간_범위_혼잡도_데이터_가져오기() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeHoursAgo = now.minusHours(3);
        System.out.println("threeHoursAgo = " + threeHoursAgo);
        LocalDate localDate = threeHoursAgo.toLocalDate();
        System.out.println("localDate = " + localDate);

        List<CafeCrowd> crowdList = cafeCrowdRepository
                .findAllByCreatedAtBetweenAndCafeId(threeHoursAgo, now, 1);
        for (CafeCrowd cafeCrowd : crowdList) {
            System.out.println("cafeCrowd = " + cafeCrowd);
        }
    }

    @Test
    @Transactional
    void 위치인증체크_테스트() throws Exception {
        // 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        String nickname = "testUser2";
        long cafeId = 100;

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(600) // 600초
                .build();

        cafeAuthRepository.save(cafeAuth); // 인증된 상태 세팅

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname
        System.out.println("cafeAuthOptional.get() = " + cafeAuthOptional.get());

        String getNickname = cafeAuthOptional.get().getNickname();
        System.out.println("getNickname = " + getNickname);
        long getCafeId = cafeAuthOptional.get().getCafeId();
        System.out.println("getCafeId = " + getCafeId);

        // 존재한다면 삭제후 갱신
        assertThat(cafeAuthOptional.get().getCafeId()).isEqualTo(cafeId);

        cafeAuthRepository.deleteById(nickname);
        // 삭제 확인
        Optional<CafeAuth> cafeAuthOptional2 = cafeAuthRepository.findById(nickname);
        System.out.println("cafeAuthOptional2 = " + cafeAuthOptional2);
//        System.out.println("cafeAuthOptional2.get() = " + cafeAuthOptional2.get());

        assertThat(cafeAuthOptional2.isEmpty()).isTrue();

        // 재생성
        CafeAuth cafeAuth2 = CafeAuth.builder()
                .cafeId(getCafeId)
                .nickname(getNickname)
                .expiration(60) // 60초
                .build();

        CafeAuth saveAuth2 = cafeAuthRepository.save(cafeAuth2);
        Optional<CafeAuth> cafeAuthOptional3 = cafeAuthRepository.findById(nickname);
        System.out.println("cafeAuthOptional3 = " + cafeAuthOptional3);
        System.out.println("cafeAuthOptional3.get() = " + cafeAuthOptional3.get());
        assertThat(saveAuth2.getNickname()).isEqualTo(nickname);
    }

    @Test
    @Transactional
    void 카페위치인증_레디스_테스트() throws Exception {

        String nickname = "TestUser";
        long cafeId = 200;

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(60) // 60초
                .build();

        CafeAuth savedCafeAuth = cafeAuthRepository.save(cafeAuth);

        assertThat(savedCafeAuth.getNickname()).isEqualTo(nickname);
        assertThat(savedCafeAuth.getCafeId()).isEqualTo(cafeId);

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname);

        assertThat(cafeAuthOptional.get().getNickname()).isEqualTo(nickname);
        assertThat(cafeAuthOptional.get().getCafeId()).isEqualTo(cafeId);
    }
}