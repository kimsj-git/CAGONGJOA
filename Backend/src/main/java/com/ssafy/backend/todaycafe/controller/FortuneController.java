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
@RequestMapping("todaycafe/fortune")
@RequiredArgsConstructor
public class FortuneController {
    private ResponseDTO responseDTO;
    private final TodayCafeService todayCafeService;

    @Auth
    @CafeAuth
    @GetMapping ("/{fortuneType}")
    public ResponseEntity<ResponseDTO> giveFortune(@PathVariable int fortuneType) throws Exception {
        System.out.println("fortuneType : " + fortuneType);
        FortuneResponseDto fortuneResponseDto = todayCafeService.randomFortune(fortuneType);

        switch (fortuneResponseDto.getResponseType()) {
            case 1: responseDTO = new ResponseDTO("","[responseType 1] [NOT_IMPLEMENTED]ERR CafeVisit 이 없음",HttpStatus.BAD_REQUEST,null); break;
            case 2: responseDTO = new ResponseDTO("[responseType 2] 처음뽑기 완료","",HttpStatus.OK,fortuneResponseDto); break;
            case 3: responseDTO = new ResponseDTO("[responseType 3] 다시뽑기 완료","",HttpStatus.OK,fortuneResponseDto); break;
            case 4: responseDTO = new ResponseDTO("","[responseType 4] ERR [NOT_IMPLEMENTED] 1 커피가 없어요",HttpStatus.NOT_IMPLEMENTED,fortuneResponseDto); break;
            case 5: responseDTO = new ResponseDTO("","[responseType 5] ERR [NOT_IMPLEMENTED] parameter 오류",HttpStatus.NOT_IMPLEMENTED,null); break;
        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


}
