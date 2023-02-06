package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;

public interface TodayCafeService {

    // 커피 내리기

    CoffeeMakeResponseDto makeCoffee(int type) throws Exception;

    String randomFortune(int type) throws Exception;

}
