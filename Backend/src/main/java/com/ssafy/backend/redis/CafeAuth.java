package com.ssafy.backend.redis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

// 600초

@RedisHash(value = "nicknameInCafe") // key: nicknameInCafe:{nickname} & value: 요 객체 (해쉬)
@Getter
@AllArgsConstructor
@Builder
public class CafeAuth {

    @Id
    private String nickname;

    private long cafeId;

    @TimeToLive
    private Integer expiration;
}
