package com.ssafy.backend.post.controller;


import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.post.domain.dto.PostLikeRequestDto;
import com.ssafy.backend.post.domain.dto.PostLikeResponseDto;
import com.ssafy.backend.post.domain.dto.PostPagingRequestDto;
import com.ssafy.backend.post.domain.dto.PostPagingResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.service.PostService;
import com.ssafy.backend.post.util.PostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("main/post")
@RequiredArgsConstructor

public class PostMainController {
    private final PostService postService;
    private final PostUtil postUtil;

    private ResponseDTO responseDTO;


    /**
     * 1-1. 메인페이지 글목록 주기 (1차 테스트 완료 - 추후 유저정보, 카테고리 추가 (JPQL)
     **/

    @Auth
    @PostMapping("/feed")
    public ResponseEntity<ResponseDTO> postMain(
            @RequestBody PostPagingRequestDto requestDto,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) throws Exception {

        Slice<PostPagingResponseDto> postSlice = postService.feedPosts(requestDto, pageable);

        System.out.println(postSlice.getContent());

        responseDTO
                = new ResponseDTO("카페 위치 인증 버튼 click", "", HttpStatus.OK, null);
        // 리턴객체 : 유저정보(카페로고, 닉네임, 칭호, 카페이름), 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수, 게시물 PK

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 1-2. 게시글 좋아요 누르기  [테스트완료]
     **/
    @Auth
//  @CafeAuth  // 카페인증 되어야 누를수있음
    @PostMapping("/like")
    public ResponseEntity<ResponseDTO> postLike(
            @RequestBody PostLikeRequestDto likeRequestDto) throws Exception {

        PostLikeResponseDto likeResponseDto = postService.likePost(likeRequestDto);

        if(likeResponseDto != null ){
            responseDTO = new ResponseDTO("게시글 좋아요 반영 완료", "", HttpStatus.OK, likeResponseDto);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }
        else {
            responseDTO = new ResponseDTO("", "400에러(잘못된요청) : 중복 좋아요 에러, 처리 X", HttpStatus.BAD_REQUEST, null);
            return new ResponseEntity<>(responseDTO, HttpStatus.BAD_REQUEST);
        }


    }

    /**
     * 1-3. 선택한 게시글 (상세페이지) 조회
     **/

  @Auth
    @PostMapping("/detail")
    public ResponseEntity<Void> postDetail(@RequestParam Long postId) throws Exception {
        postService.findOnePost(postId);

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * 1-4. 글쓰기 클릭  [테스트완료]
     **/
    @Auth
//    @CafeAuth
    @PostMapping("/write")
    public ResponseEntity<ResponseDTO> postWrite() throws Exception {

        responseDTO = new ResponseDTO("유저 인증됨!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);

    }


}
