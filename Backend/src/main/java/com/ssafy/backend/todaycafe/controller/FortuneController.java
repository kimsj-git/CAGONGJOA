package com.ssafy.backend.todaycafe.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.FortuneResponseDto;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortune")
@RequiredArgsConstructor
public class FortuneController {

    private final TodayCafeService todayCafeService;

    @Auth
    @CafeAuth
    @GetMapping
    public ResponseEntity<ResponseDTO> getFortune() {
        FortuneResponseDto fortuneResponseDto = todayCafeService.getFortune();
        ResponseDTO responseDTO = new ResponseDTO("운세 뽑기 완료!", "", HttpStatus.OK, fortuneResponseDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


}
