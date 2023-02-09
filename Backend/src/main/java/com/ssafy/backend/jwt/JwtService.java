package com.ssafy.backend.jwt;

import com.ssafy.backend.jwt.dto.TokenRespDto;
import com.ssafy.backend.member.domain.entity.Member;

import java.util.Map;

public interface JwtService {

    TokenRespDto createJwt(Member member);

}
