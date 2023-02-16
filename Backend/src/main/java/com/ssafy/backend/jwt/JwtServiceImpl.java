package com.ssafy.backend.jwt;

import com.ssafy.backend.common.exception.jwt.JwtException;
import com.ssafy.backend.common.exception.jwt.JwtExceptionType;
import com.ssafy.backend.jwt.dto.TokenRespDto;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.redis.RefreshToken;
import com.ssafy.backend.redis.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService{

    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public TokenRespDto createJwt(Member member) {
        // 토큰 발급
        String accessToken = jwtUtil.getAccessToken(member);
        String refreshToken = jwtUtil.getRefreshToken(member);

        System.out.println("우리의 JWT accessToken = " + accessToken);

        // 리프레쉬 토큰을 redis에 저장
        RefreshToken savedRefreshToken = refreshTokenRepository.save(new RefreshToken(refreshToken, member.getId()));

        if (refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).isEmpty()) {
            throw new JwtException(JwtExceptionType.TOKEN_SAVE_FAIL);
        }

        // Access token + refresh token을 리턴
        return TokenRespDto.builder()
                .AccessToken(accessToken)
                .RefreshToken(refreshToken)
                .build();
    }
}
