package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.cafe.domain.dto.AfterCafeAuthResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.FortuneResponseDto;

public interface TodayCafeService {

    // 커피 내리기

    CoffeeMakeResponseDto makeCoffee(int type) throws Exception;

    FortuneResponseDto randomFortune(int type) throws Exception;

    AfterCafeAuthResponseDto saveCafeVisit() throws Exception;
}
