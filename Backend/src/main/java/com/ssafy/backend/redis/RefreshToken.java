package com.ssafy.backend.redis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

// 60초
@RedisHash(value = "refreshToken", timeToLive = 60)
@Getter
@AllArgsConstructor
public class RefreshToken {

    @Id
    private String refreshToken;
    private Long memberId;

}