package com.ssafy.backend.todaycafe.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.FortuneResponseDto;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("todaycafe/fortune")
@RequiredArgsConstructor
public class FortuneController {
    private ResponseDTO responseDTO;
    private final TodayCafeService todayCafeService;

    @Auth
//    @CafeAuth
    @PutMapping("/")
    public ResponseEntity<ResponseDTO> giveFortune(@RequestParam int fortuneType) throws Exception {
        System.out.println("fortuneType : " + fortuneType);
        FortuneResponseDto fortuneResponseDto = todayCafeService.randomFortune(fortuneType);

//        switch (coffeeMakeResponseDto.getResponseType()) {
//            case 1: responseDTO = new ResponseDTO("","[responseType 1] ERR [BAD_REQUEST]: 해당 계정이 없어요",HttpStatus.BAD_REQUEST,null); break;
//            case 2: responseDTO = new ResponseDTO("[responseType 2] 10커피콩 -> 1커피콩 완료","",HttpStatus.OK,coffeeMakeResponseDto); break;
//            case 3: responseDTO = new ResponseDTO("","[responseType 3] ERR [NOT_IMPLEMENTED] : 10커피콩이 없어요",HttpStatus.NOT_IMPLEMENTED,coffeeMakeResponseDto); break;
//            case 4: responseDTO = new ResponseDTO("[responseType 4] 27커피콩 -> 3커피콩 완료","",HttpStatus.OK,coffeeMakeResponseDto); break;
//            case 5: responseDTO = new ResponseDTO("","[responseType 5] ERR [NOT_IMPLEMENTED] : 27커피콩이 없어요",HttpStatus.NOT_IMPLEMENTED,coffeeMakeResponseDto); break;
//            case 6: responseDTO = new ResponseDTO("","[responseType 6] ERR [BAD_REQUEST]: Unknown Error",HttpStatus.BAD_REQUEST,coffeeMakeResponseDto); break;
//        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


}
