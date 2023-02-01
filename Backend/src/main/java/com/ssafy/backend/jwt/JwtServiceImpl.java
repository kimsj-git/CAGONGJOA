package com.ssafy.backend.jwt;

import com.ssafy.backend.member.domain.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

        System.out.println("우리의 JWT accessToken = " + accessToken);

        // 리프레쉬 토큰을 redis에 저장
        RefreshToken savedRefreshToken = refreshTokenRepository.save(new RefreshToken(refreshToken, member.getId()));
        System.out.println("savedRefreshToken.getRefreshToken() ="+savedRefreshToken.getRefreshToken()); // 제대로 나옴
        System.out.println("savedRefreshToken.getMemberId() ="+savedRefreshToken.getMemberId()); // 제대로 나옴
        // 옵셔널로 나옴
        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()));
        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널 깨기)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).get());
        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널 깬 객체로 토큰 찍어보기)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).get().getRefreshToken());


        if (refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).isEmpty()) {
            System.out.println("리프레쉬 토큰 만료!! -> 사용자 로그아웃 및 로그인 페이지 출력");
        }

        // 리프레쉬 토큰이 레디스에 존재
        refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).ifPresent(a->{
            System.out.println("억세스 발급");
        });

        // Access token + refresh token을 리턴
        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
}
