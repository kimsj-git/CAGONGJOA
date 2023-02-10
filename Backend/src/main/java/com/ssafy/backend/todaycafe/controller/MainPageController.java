package com.ssafy.backend.todaycafe.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.todaycafe.domain.dto.FortuneResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.SurveyRequestDto;
import com.ssafy.backend.todaycafe.domain.dto.TodoReqeustDto;
import com.ssafy.backend.todaycafe.domain.dto.TodoResponseDto;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("todaycafe/main")
@RequiredArgsConstructor
public class MainPageController {
    private ResponseDTO responseDTO = new ResponseDTO("","",HttpStatus.OK,null);
    private final TodayCafeService todayCafeService;


    @Auth
    @CafeAuth
    @PostMapping ("/todo")
    public ResponseEntity<ResponseDTO> writeTodo(@RequestBody TodoReqeustDto todoReqeustDto) throws Exception {
        int result =  todayCafeService.todoEvent(todoReqeustDto);

        switch (result) {
            case 0: responseDTO.setErrMsg("[responseType 0] eventType 오류!"); break;
            case 1: responseDTO.setErrMsg("[responseType 1] visitedAt 은 0이면안됨"); break;
            case 2: responseDTO.setErrMsg("[responseType 2] 글생성시 content는 null이면안됨"); break;
            case 3: responseDTO.setMsg("[responseType 3] 글생성 완료!"); break;
            case 4: responseDTO.setErrMsg("[responseType 4] todo ID 줭"); break;
            case 5: responseDTO.setErrMsg("[responseType 5] 잘못된 todo Id"); break;
            case 6: responseDTO.setErrMsg("[responseType 6] 글 업데이트 시 content는 null이면안됨"); break;
            case 7: responseDTO.setErrMsg("[responseType 7] DB에 있는 값이랑 다름! 꾸짖을 갈!"); break;
            case 8: responseDTO.setMsg("[responseType 8] 체크박스 토글 완료"); break;
            case 9: responseDTO.setMsg("[responseType 9] 글 삭제 완료"); break;
            case 99: responseDTO.setErrMsg("[responseType 99] unknown Error"); break;
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
    @Auth
    @GetMapping ("/todo/feed")
    public ResponseEntity<ResponseDTO> findTodo(@RequestParam int visitedAt) throws Exception {


        List<TodoResponseDto> todoList = todayCafeService.findTodo(visitedAt);
        if(todoList == null) {
            responseDTO = new ResponseDTO("불러올 todo 가 없음","",HttpStatus.OK,null);
        }else {
            responseDTO = new ResponseDTO("Todo List 불러오기 완료!","",HttpStatus.OK,todoList);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }



    @Auth
    @CafeAuth
    @PostMapping ("/survey")
    public ResponseEntity<ResponseDTO> submitSurvey(@RequestBody SurveyRequestDto surveyRequestDto) throws Exception {
        int result =  todayCafeService.saveSurvey(surveyRequestDto);

        switch (result) {
            case 1: responseDTO = new ResponseDTO("","[responseType 1] 이미 인증한 유저임",HttpStatus.OK, null); break;
            case 2: responseDTO = new ResponseDTO("","[responseType 2] 조사 결과가 저장이 안됨",HttpStatus.OK, null); break;
            case 3:
                Map.Entry<String, Boolean> responseData = new AbstractMap.SimpleEntry<>("설문 제출한 유저인가",true);
                responseDTO = new ResponseDTO("조사결과 저장완료","",HttpStatus.OK, responseData); break;
        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

}
