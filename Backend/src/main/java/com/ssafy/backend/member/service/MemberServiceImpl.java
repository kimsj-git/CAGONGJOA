package com.ssafy.backend.member.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.member.MemberException;
import com.ssafy.backend.common.exception.member.MemberExceptionType;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.jwt.RefreshTokenRepository;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.enums.NicknameType;
import com.ssafy.backend.member.domain.enums.OauthType;
import com.ssafy.backend.member.repository.MemberRepository;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void checkDuplicatedNickname(String nickName) {
        // 닉네임 조회 후 존재하면 에러 발생 시킴
        memberRepository.findByNickname(nickName).ifPresent(x->{
            throw new MemberException(MemberExceptionType.ALREADY_EXIST_NICKNAME);
        });
    }

    @Override
    public void changeNickname(Member member, String newNickname) throws Exception {

        // 닉네임 유효성 체크 = 받는 dto에서!

        if (member.getNickname().equals(newNickname)) {
            throw new Exception("바꾸려는 닉네임이 기존과 동일"); // 임시 ***
        }

        member.setNickname(newNickname);
    }

    @Override
    public Optional<Member> getMember(long kakaoMemberId, OauthType kakao) {
        return memberRepository.findByOauthIdAndOauthType(kakaoMemberId, OauthType.KAKAO);
    }

    @Override
    public void saveMember(long oAuthId, String nickname, OauthType oauthType) {
        memberRepository.save(Member.oAuthBuilder()
                .nickname(nickname)
                .oAuthId(oAuthId)
                .oAuthType(oauthType)
                .build());
    }

    @Override
    public Map<String, Object> tokenRefresh() throws Exception {
        // refresh token 받아오기
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String refreshToken = request.getHeader("Authorization");

        // refresh token 인증
        jwtUtil.isValidForm(refreshToken);
        refreshToken = refreshToken.substring(7);
        jwtUtil.isValidToken(refreshToken, "refreshToken");

        // refresh token 에서 유저 aud값 가져오기
        DecodedJWT payload = jwtUtil.getDecodedJWT(refreshToken);
        long memberId = Long.parseLong(payload.getAudience().get(0));

        // redis에 refresh 토큰이 없다면(리프레쉬 토큰 만료시)
        if (refreshTokenRepository.findById(refreshToken).isEmpty()) {
            throw new Exception("리프레쉬 토큰 만료!! -> 사용자 로그아웃 및 로그인 페이지 출력, 재로그인!");
        }

        HashMap<String, Object> tokens = new HashMap<>();

        // 리프레쉬 토큰이 redis에 존재
        refreshTokenRepository.findById(refreshToken).ifPresent(a->{
            System.out.println("억세스 발급");
            Optional<Member> dbMemberOpt = memberRepository.findById(memberId);
            if (dbMemberOpt.isEmpty()) {
                throw new MemberException(MemberExceptionType.NOT_FOUND_MEMBER);
            }
            Member dbMember = dbMemberOpt.get();
            String accessToken = jwtUtil.getAccessToken(dbMember);

            tokens.put("accessToken", accessToken);

        });
        return tokens;
    }

    @Override
    public void logout() throws Exception {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String accessToken = request.getHeader("Authorization").substring(7);

        DecodedJWT payload = jwtUtil.getDecodedJWT(accessToken);
        int userId = Integer.parseInt(payload.getAudience().get(0));

        userMapper.deleteUserRefreshToken(userId);
    }

}
