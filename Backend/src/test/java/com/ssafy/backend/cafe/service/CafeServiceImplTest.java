package com.ssafy.backend.cafe.service;

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
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CafeServiceImplTest {
    @Autowired
    CafeAuthRepository cafeAuthRepository;


    @Test
    @Transactional
    void 위치인증체크_테스트() throws Exception {
        // 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        String nickname = "testUser2";
        long cafeId = 100;

        CafeAuth cafeAuth = CafeAuth.builder()
                .cafeId(cafeId)
                .nickname(nickname)
                .expiration(60) // 60초
                .build();

        cafeAuthRepository.save(cafeAuth); // 인증된 상태 세팅

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname); // key = nickname

        String getNickname = cafeAuthOptional.get().getNickname();
        long getCafeId = cafeAuthOptional.get().getCafeId();

        // 존재한다면 삭제후 갱신
        assertThat(cafeAuthOptional.get().getCafeId()).isEqualTo(cafeId);

        cafeAuthRepository.deleteById(nickname);
        // 삭제 확인
        Optional<CafeAuth> cafeAuthOptional2 = cafeAuthRepository.findById(nickname);
        assertThat(cafeAuthOptional2.isEmpty()).isTrue();

        // 재생성
        CafeAuth cafeAuth2 = CafeAuth.builder()
                .cafeId(getCafeId)
                .nickname(getNickname)
                .expiration(60) // 60초
                .build();

        CafeAuth saveAuth2 = cafeAuthRepository.save(cafeAuth2);
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