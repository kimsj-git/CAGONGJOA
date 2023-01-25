package com.ssafy.backend.common.util;

import com.ssafy.backend.jwt.JwtUtil;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class JwtUtilTest {

    @Autowired
    JwtUtil jwtUtil;

    @Test
    void 설정테스트() {
//        System.out.println("JWT secret: "+ jwtUtil.getSecret());
//        System.out.println("JWT key" + jwtUtil.getKey());

        Assertions.assertThat(jwtUtil.getSecret()).isNotEmpty();
        Assertions.assertThat(jwtUtil.getKey()).isNotNull();
    }

}