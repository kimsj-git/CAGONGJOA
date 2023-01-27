package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 닉네임 중복체크 (회원가입, 유저 정보 수정)
    @GetMapping("/checkDuplicatedNickname")
    public ResponseEntity<Void> checkValidEmail(@RequestParam String nickname) {
        memberService.checkDuplicatedNickname(nickname);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 억세스 토큰 만료시 토큰 리프레쉬
    @Auth
    @GetMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh() throws Exception {
        return new ResponseEntity<>(memberService.tokenRefresh(), HttpStatus.OK);
    }

    @Auth
    @GetMapping("/logout")
    public ResponseEntity<Void> logout() throws Exception { // refresh token 헤더로 가져오기
        memberService.logout();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
