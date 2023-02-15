package com.ssafy.backend.member.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
class MemberServiceImplTest {

    @Test
    void 자바_스트링_양끝제거() {
        String str = "\"example string\"";
        String trimmedStr = str.replaceAll("\"", "");

        System.out.println("trimmedStr = " + trimmedStr);
        Assertions.assertThat(trimmedStr).isEqualTo("example string");
    }

}