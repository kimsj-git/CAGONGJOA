package com.ssafy.backend.member.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.common.exception.jwt.JwtException;
import com.ssafy.backend.common.exception.jwt.JwtExceptionType;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.service.MemberServiceImpl;
import com.ssafy.backend.post.domain.dto.CheckedResponseDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static com.ssafy.backend.common.exception.jwt.JwtExceptionType.JWT_VERIFICATION_EXCEPTION;

@Component
@RequiredArgsConstructor
public class MemberUtil {
    private final MemberServiceImpl memberService;
    /**
     * 0. 유저 확인
     **/
    public CheckedResponseDto checkMember() {

        // 1. accessToken 을 해독하여, payload 에서 memberId 와 nickname 을 가져온다.
        MemberIdAndNicknameDto memberIdAndNicknameDto = memberService.getMemberIdAndNicknameByJwtToken();
        if (memberIdAndNicknameDto == null) throw new JwtException(JWT_VERIFICATION_EXCEPTION); // JWT 유효성 체크
        Long memberId = memberIdAndNicknameDto.getId();
        String nickname = memberIdAndNicknameDto.getNickname();

        CheckedResponseDto checkedResponseDto = CheckedResponseDto.builder()
                .nickname(nickname)
                .memberId(memberId)
                .build();

        return checkedResponseDto;
    }
}

