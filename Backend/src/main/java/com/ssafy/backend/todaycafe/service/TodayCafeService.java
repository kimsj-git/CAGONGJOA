package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.cafe.domain.dto.AfterCafeAuthResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.*;

import java.util.List;

public interface TodayCafeService {

    // 커피 내리기

    CoffeeMakeResponseDto makeCoffee(int type) throws Exception;

    FortuneResponseDto randomFortune(int type) throws Exception;

    AfterCafeAuthResponseDto saveCafeVisit() throws Exception;

    int saveSurvey(SurveyRequestDto surveyRequestDto) throws Exception;

    int todoEvent(TodoReqeustDto todoReqeustDto) throws Exception;

    List<TodoResponseDto> findTodo(int visitedAt) throws Exception;
}
