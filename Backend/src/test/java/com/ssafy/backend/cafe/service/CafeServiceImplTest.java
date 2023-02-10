package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.repository.CafeCrowdRepository;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CafeServiceImplTest {

    @Autowired
    CafeAuthRepository cafeAuthRepository;

    @Autowired
    CafeCrowdRepository cafeCrowdRepository;

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