package com.ssafy.backend.oauth;

import com.ssafy.backend.jwt.JwtService;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.enums.NicknameType;
import com.ssafy.backend.member.domain.enums.OauthType;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.oauth.dto.OauthLoginDto;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Transactional
@RequestMapping("/oauth")
public class OAuthController {

    private final OAuthService oAuthService;
    private final MemberService memberService;
    private final JwtService jwtService;

    /**
     * 카카오 callback
     * [GET] /oauth/kakao/callback
     */
    @GetMapping("/kakao")
    public ResponseEntity<Map<String, Object>> kakaoCallback(@RequestParam String code) throws Exception {
        System.out.println(code);
        Map<String, Object> resultMap = new HashMap<>();

        // 클라이언트에게 받은 code로 AccessToken 생성
        String kakaoAccessToken = oAuthService.getKakaoAccessToken(code);

        // 생성한 AccessToken으로 인증서버로부터 유저 정보 가져오기
        Map<String, String> kakaoMemberInfo = oAuthService.getKakaoMemberInfo(kakaoAccessToken);

        long kakaoMemberId = Long.parseLong(kakaoMemberInfo.get("id"));
        Optional<Member> dbMember = memberService.getMember(kakaoMemberId, OauthType.KAKAO);


        // db에 해당 kakao oAuth의 id를 가진 레코드가 없다면 등록
        if (dbMember.isEmpty()) {
            // 신규 회원 등록
            memberService.saveMember(kakaoMemberId, NicknameType.DEFAULT.toString(), OauthType.KAKAO);

            resultMap.put("memberInfo", new OauthLoginDto(NicknameType.DEFAULT.toString(),
                    kakaoMemberId, OauthType.KAKAO.toString()));

            // 해당 상태코드를 받고 프론트에서 닉네임 표출하는 화면 주기 201
            // 클라에서 201를 받으면 닉네임 입력 페이지를 띄워줘라!!
            return new ResponseEntity<>(resultMap, HttpStatus.CREATED);
        }

        // if 닉네임이 아직도 DEFAULT면 위랑 상태코드 똑같이 해서 닉네임 받는 페이지 가도록
        if (dbMember.get().getNickname().equals(NicknameType.DEFAULT.toString())) {
            resultMap.put("memberInfo", new OauthLoginDto(NicknameType.DEFAULT.toString(),
                    kakaoMemberId, OauthType.KAKAO.toString()));
            return new ResponseEntity<>(resultMap, HttpStatus.CREATED);
        }

        // 여까지 왔으면 로그인 할 자격이 있다. 닉네임과 억세스id로 jwt토큰 생성해 클라이언트에 보내주기
        System.out.println("dbMember = " + dbMember);

        Map<String, Object> jwtTokens = jwtService.createJwt(dbMember.get());
        // 200 ok + jwt토큰 전송
        resultMap.put("jwt", jwtTokens);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);


    }

    // 회원가입 후 DEFAULT 닉네임을 변경
    @PostMapping("/setNickname")
    public ResponseEntity<Map<String, Object>> setMemberNickname(@RequestBody OauthLoginDto oauthLoginDto) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        Optional<Member> defaultNicknameMember = memberService.getMember(oauthLoginDto.getOauthId(),
                OauthType.valueOf(oauthLoginDto.getOauthType()));
        // 서버에서 한번 더 닉네임 중복 체크
        memberService.checkDuplicatedNickname(oauthLoginDto.getNickname());
        // 닉네임 변경
        memberService.changeNickname(defaultNicknameMember.get(), oauthLoginDto.getNickname());
        // jwt 토큰 생성
        Map<String, Object> jwtTokens = jwtService.createJwt(defaultNicknameMember.get());
        // 리턴
        resultMap.put("jwt", jwtTokens);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
