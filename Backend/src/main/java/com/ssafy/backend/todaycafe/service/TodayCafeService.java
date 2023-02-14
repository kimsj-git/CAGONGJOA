package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.cafe.domain.dto.AfterCafeAuthResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.*;

import java.util.List;

public interface TodayCafeService {

    /** 1. 커피내리기   **/
    CoffeeMakeResponseDto makeCoffee(int type);

    /** 2. 랜덤 운세   **/
    FortuneResponseDto randomFortune(int type);

    /** 3. 카페 방문일지 저장  **/
    AfterCafeAuthResponseDto saveCafeVisit();

    /** 4. 설문결과 저장   **/
    void saveSurvey(SurveyRequestDto surveyRequestDto);

    /** 5. todo Create,Update,Delete, 체크박스 토글  **/
    TodoResponseDto todoEvent(TodoReqeustDto todoReqeustDto);

    /** 6. Todo List 가져오기   **/
    List<TodoResponseDto> findTodo(int visitedAt);

    /** 7. 타임바에 추가하기   **/
    int addTimeBar();

    int getAccTime(int todayDate);
}
