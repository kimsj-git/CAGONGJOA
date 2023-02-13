package com.ssafy.backend.mypage.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.mypage.domain.dto.*;
import com.ssafy.backend.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
     *
     * @return
     */
    @GetMapping("/cafeLive")
    public ResponseEntity<ResponseDTO> getCafeLive(@RequestParam int todayDate) {

        List<CafeLiveRespDto> cafeLives = myPageService.getCafeLives(todayDate);

        ResponseDTO responseDTO = new ResponseDTO("회원의 한달치 카공조아 이용 내역", "", HttpStatus.OK, cafeLives);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 2. 사용자가 방문한 모든 카페의 리스트(w 경험치) 를 불러온다
     */
    @Auth
    @GetMapping("/cafeList")
    public ResponseEntity<ResponseDTO> getCafeList() {

        List<VisitCafeListResponseDto> cafeVisitList = myPageService.getCafeVisitList();

        ResponseDTO responseDTO = new ResponseDTO("카페 티어 리스트 불러오기 완료!", "", HttpStatus.OK, cafeVisitList);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 3. 내가쓴 글 조회하기
     */

    @Auth
    @GetMapping("/myFeed")
    public ResponseEntity<ResponseDTO> getMyComment(@RequestParam Long postId,
                                                 @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        List<MyFeedResponseDto> myFeedList = myPageService.getMyFeed(postId, pageable);

        ResponseDTO responseDTO = new ResponseDTO("내 댓글목록 불러오기 완료!", "", HttpStatus.OK, myFeedList);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 4. 내가쓴 댓글 조회하기
     */

    @Auth
    @GetMapping("/myComment")
    public ResponseEntity<ResponseDTO> getMyFeed(@RequestParam Long commentId,
                                                 @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        List<MyCommentResponseDto> myCommentList = myPageService.getMyComment(commentId, pageable);

        ResponseDTO responseDTO = new ResponseDTO("내 글목록 불러오기 완료!", "", HttpStatus.OK, myCommentList);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


}
