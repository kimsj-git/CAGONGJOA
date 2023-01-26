package com.ssafy.backend.member.controller;

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

//    // 회원가입
//    @PostMapping("/signUp")
//    public ResponseEntity<Void> signUp(@RequestBody UserDto userDto) {
//        userService.signUp(userDto);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    // 로그인
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> signIn(@RequestBody UserDto userDto) {
//        // 로그인 성공시 "accessToken", "refreshToken"을 key로 하는 토큰 데이터가 담긴 hash map 리턴
//        return new ResponseEntity<>(userService.signIn(userDto), HttpStatus.OK);
//    }

    // 닉네임 중복체크 (회원가입, 유저 정보 수정)
    @GetMapping("/checkDuplicatedNickname")
    public ResponseEntity<Void> checkValidEmail(@RequestParam String nickname) {
        memberService.checkDuplicatedNickname(nickname);
        return new ResponseEntity<>(HttpStatus.OK);
    }
//
//    @PostMapping("/signUp/verify")
//    public ResponseEntity<Void> verifyRegisterCode(@RequestBody UserAuthRequest authRequest) {
//        userService.verifyRegisterCode(authRequest);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @GetMapping("/refresh")
//    public ResponseEntity<Map<String, Object>> refresh() {
//        return new ResponseEntity<>(memberService.refresh(), HttpStatus.OK);
//    }
//
//    @Auth
//    @GetMapping("/logout")
//    public ResponseEntity<Void> logout() {
//        userService.logout();
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
//

}
