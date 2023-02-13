package com.ssafy.backend.todaycafe.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("todaycafe/coffeemaking")
@RequiredArgsConstructor
public class CoffeeMakeController {
    private ResponseDTO responseDTO;
    private final TodayCafeService todayCafeService;

    @Auth
    @CafeAuth
    @PutMapping("/")
    public ResponseEntity<ResponseDTO> makeOneCoffee(@RequestParam int coffeeMakeType) throws Exception {
        CoffeeMakeResponseDto coffeeMakeResponseDto = todayCafeService.makeCoffee(coffeeMakeType);
        switch (coffeeMakeType) {
            case 1: responseDTO = new ResponseDTO("[responseType 1] 10커피콩 -> 1커피콩 완료","",HttpStatus.OK,coffeeMakeResponseDto); break;
            case 2: responseDTO = new ResponseDTO("[responseType 2] 27커피콩 -> 3커피콩 완료","",HttpStatus.OK,coffeeMakeResponseDto); break;
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
