package com.ssafy.backend.jwt;

import com.ssafy.backend.member.domain.entity.Member;

import java.util.Map;

public interface JwtService {

    Map<String, Object> createJwt(Member member);

}
