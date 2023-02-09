package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
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
    public ResponseEntity<ResponseDTO> checkDupNick(@RequestParam String nickname) {
        memberService.checkDuplicatedNickname(nickname);
        ResponseDTO responseDTO = new ResponseDTO("닉네임 중복 체크 완료", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    // 억세스 토큰 만료시 토큰 리프레쉬
    @GetMapping("/refresh")
    public ResponseEntity<ResponseDTO> refresh() {
        memberService.tokenRefresh();
        ResponseDTO responseDTO = new ResponseDTO("Access token refresh!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @Auth
    @GetMapping("/logout")
    public ResponseEntity<Void> logout() { // refresh token 헤더로 가져오기
        // 로그아웃시 1. redis의 refresh 토큰 지우기 2. redis의 위치인증 정보 지우기
        memberService.logout();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping
    public ResponseEntity<ResponseDTO> deleteMember() {
//        memberService.logout();
        memberService.deleteMember();
        ResponseDTO responseDTO = new ResponseDTO("회원 삭제 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

}
