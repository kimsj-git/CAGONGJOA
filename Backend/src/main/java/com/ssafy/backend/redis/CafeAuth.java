package com.ssafy.backend.redis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

// 600초
@RedisHash(value = "refreshToken", timeToLive = 600)
@Getter
@AllArgsConstructor
public class CafeAuth {

    @Id
    private String nickname;
    private long cafeId;
}
