package com.ssafy.backend.member.controller;

import com.ssafy.backend.cafe.domain.dto.LocationDto;
import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.jwt.dto.TokenRespDto;
import com.ssafy.backend.member.domain.dto.MemberCoinRespDto;
import com.ssafy.backend.member.domain.dto.SuperMemberCafeAuthReqDto;
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
        TokenRespDto tokenRespDto = memberService.tokenRefresh();
        ResponseDTO responseDTO = new ResponseDTO("Access token refresh!", "", HttpStatus.OK, tokenRespDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @Auth
    @GetMapping("/logout")
    public ResponseEntity<ResponseDTO> logout() { // refresh token 헤더로 가져오기
        // 로그아웃시 1. redis의 refresh 토큰 지우기 2. redis의 위치인증 정보 지우기
        memberService.logout();
        ResponseDTO responseDTO = new ResponseDTO("logout 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<ResponseDTO> deleteMember() {
//        memberService.logout();
        memberService.deleteMember();
        ResponseDTO responseDTO = new ResponseDTO("회원 삭제 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    @Auth
    @GetMapping("/coin")
    public ResponseEntity<ResponseDTO> getMemberCoin() {
        MemberCoinRespDto memberCoinRespDto = memberService.getMemberCoin();
        ResponseDTO responseDTO = new ResponseDTO("회원 재화정보 제공 완료!", "", HttpStatus.OK, memberCoinRespDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 시연을 위한 위치인증 슈퍼 계정
     * @return
     */
    @Auth
    @PostMapping("/super/hynchol")
    public ResponseEntity<ResponseDTO> setHyncholAuth(@RequestBody SuperMemberCafeAuthReqDto superMemberCafeAuthReqDto) {
        memberService.setHyncholAuth(superMemberCafeAuthReqDto);
        ResponseDTO responseDTO = new ResponseDTO("조현철 치트키 적용 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
