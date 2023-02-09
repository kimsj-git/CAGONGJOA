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

        System.out.println("12. 우리의 JWT accessToken = " + accessToken);

        // 리프레쉬 토큰을 redis에 저장
        RefreshToken savedRefreshToken = refreshTokenRepository.save(new RefreshToken(refreshToken, member.getId()));
        System.out.println("13. savedRefreshToken = " + savedRefreshToken);

        // 테스트 코드로..
//        System.out.println("savedRefreshToken.getRefreshToken() ="+savedRefreshToken.getRefreshToken()); // 제대로 나옴
//        System.out.println("savedRefreshToken.getMemberId() ="+savedRefreshToken.getMemberId()); // 제대로 나옴
//        // 옵셔널로 나옴
//        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()));
//        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널 깨기)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).get());
//        System.out.println("리프레쉬 토큰으로 객체 찾기 (옵셔널 깬 객체로 토큰 찍어보기)" + refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).get().getRefreshToken());


        if (refreshTokenRepository.findById(savedRefreshToken.getRefreshToken()).isEmpty()) {
            throw new JwtException(JwtExceptionType.TOKEN_SAVE_FAIL);
        }

        System.out.println("14. 레디스 리프레쉬 토큰이 정상적으로 저장 됨");

        // Access token + refresh token을 리턴
        return TokenRespDto.builder()
                .AccessToken(accessToken)
                .RefreshToken(refreshToken)
                .build();
    }
}
