package com.ssafy.backend.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import javax.annotation.PostConstruct;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.member.domain.dto.MemberDto;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private String secret;
    private Algorithm key;
    @Value("${jwt.access.expiration}")
    private long accessTokenValidityInMinutes;
    @Value("${jwt.refresh.expiration}")
    private long refreshTokenValidityInMinutes;
    @Value("${jwt.access.header}")
    private String accessHeader;
    @Value("${jwt.refresh.header}")
    private String refreshHeader;

    static final String ACCESS_TOKEN_SUBJECT = "AccessToken";
    static final String REFRESH_TOKEN_SUBJECT = "RefreshToken";
    static final String NICKNAME_CLAIM = "nickname";
    static final String BEARER = "Bearer ";

    @PostConstruct
    public void setKey() {
        key = Algorithm.HMAC256(secret);
    }

    // 현재 accessToken : 10분/ refreshToken : 1시간 => 배포시 늘려야됨
    public String getAccessToken(Member member) {
        return JWT.create()
                .withSubject("AccessToken")
                .withAudience(member.getId().toString())
                .withClaim(NICKNAME_CLAIM, member.getNickname())
                .withExpiresAt(Date.from(LocalDateTime.now()
                        .plusMinutes(accessTokenValidityInMinutes)
                        .atZone(ZoneId.systemDefault()).toInstant()))
                .sign(key);
    }

    public String getRefreshToken(Member member) {
        return JWT.create()
                .withSubject(REFRESH_TOKEN_SUBJECT)
                .withAudience(member.getId().toString())
                .withExpiresAt(Date.from(LocalDateTime.now()
                        .plusMinutes(refreshTokenValidityInMinutes)
                        .atZone(ZoneId.systemDefault()).toInstant()))
                .sign(key);
    }

    public void isValidForm(String token) throws Exception {
        // 토큰이 들어왔는가?
        if (token == null) {
//            throw new BaseException("token is null", HttpStatus.BAD_REQUEST);
            throw new Exception("aaa");
        }

        // 토큰이 "Bearer "로 시작하는가?
        if (!token.startsWith(BEARER)) {
//            throw new BaseException("token is not start with \"Bearer \"", HttpStatus.BAD_REQUEST);
            throw new Exception("bbb");
        }

        // 토큰이 "Bearer " 이후로 존재하는가?
        if (token.length() < 8) {
//            throw new BaseException("token is too short", HttpStatus.BAD_REQUEST);
            throw new Exception("ccc");
        }
    }

    // 1. 토큰 타입이 올바른가?
    // 2. 토큰 서명이 일치하는가?
    // 3. 토큰 발행 대상자가 존재하는가?
    public void isValidToken(String token, String tokenType) throws Exception {
        try {
            DecodedJWT decodedJWT = JWT.require(key)
                    .withSubject(tokenType)
                    .build()
                    .verify(token);

            if (decodedJWT.getAudience().isEmpty()) {
                throw new JWTVerificationException("NotValidToken"); // bad request를 클라가 받으면 로그인 페이지로
            }
        } catch (TokenExpiredException e) {
            // 토큰 만료시 -> 401 갈기고 클라이언트에서 억세스 토큰 재발급
//            throw new BaseException("TokenExpiredException", HttpStatus.UNAUTHORIZED);
            throw new Exception("ddd");
        } catch (JWTVerificationException e) {
            // 다른 경우는 모두 인증 실패
//            throw new BaseException("JWTVerificationException", HttpStatus.BAD_REQUEST);
            e.printStackTrace();
            throw new Exception("eee");
        }
    }

    // 검증 없이 토큰 디코딩
    public DecodedJWT getDecodedJWT(String token) throws Exception {
        try {
            return JWT.decode(token);
        } catch (JWTDecodeException e) {
//            throw new BaseException("Decode fail", HttpStatus.BAD_REQUEST);
            throw new Exception("fff");
        }
    }
}

