package com.ssafy.backend.jwt;

import com.ssafy.backend.member.domain.entity.Member;
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
    public Map<String, Object> createJwt(Member member) {
        // 토큰 발급
        String accessToken = jwtUtil.getAccessToken(member);
        String refreshToken = jwtUtil.getRefreshToken(member);

        // 리프레쉬 토큰을 redis에 저장
        RefreshToken savedRefreshToken = refreshTokenRepository.save(new RefreshToken(refreshToken, member.getId()));
        System.out.println("savedRefreshToken.getRefreshToken() ="+savedRefreshToken.getRefreshToken());
        System.out.println("savedRefreshToken.getMemberId() ="+savedRefreshToken.getMemberId());
        System.out.println("refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()) ="+refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()));

        // Access token + refresh token을 리턴
        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
}
