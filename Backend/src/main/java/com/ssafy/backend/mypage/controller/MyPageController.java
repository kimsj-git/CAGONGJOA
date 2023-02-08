package com.ssafy.backend.mypage.controller;

import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.GetTimeReqDto;
import com.ssafy.backend.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/myPage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    /**
     * 사용자에게 Date type을 받고 한달치 카공 생활 데이터를 준다
     * @return
     */
    @GetMapping("/cafeLive")
    public ResponseEntity<ResponseDTO> getCafeLive(@RequestParam int todayDate) {

        List<CafeLiveRespDto> cafeLives = myPageService.getCafeLives(todayDate);

        ResponseDTO responseDTO = new ResponseDTO("회원의 한달치 카공조아 이용 내역", "", HttpStatus.OK, cafeLives);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
