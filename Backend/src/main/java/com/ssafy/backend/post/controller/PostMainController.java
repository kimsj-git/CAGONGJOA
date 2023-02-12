package com.ssafy.backend.post.controller;


import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.service.CommentService;
import com.ssafy.backend.post.service.PostService;
import com.ssafy.backend.post.util.PostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("main/post")
@RequiredArgsConstructor

public class PostMainController {
    private final PostService postService;

    private ResponseDTO responseDTO;
    private final CommentService commentService;


    /**
     * 1-1. 메인페이지 글목록 주기 (1차 테스트 완료 - 추후 유저정보, 카테고리 추가 (JPQL)
     **/

    @Auth
    @PostMapping("/feed")
    public ResponseEntity<ResponseDTO> postMain(
            @RequestBody PostPagingRequestDto requestDto,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        List<PostPagingResponseDto> postSlice = postService.feedPosts(requestDto, pageable);
        responseDTO
                = new ResponseDTO("feed 생성 성공!", "", HttpStatus.OK, postSlice);


        // 리턴객체 : 유저정보(카페로고, 닉네임, 칭호, 카페이름), 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수, 게시물 PK

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 1-2. 게시글 좋아요 누르기  [테스트완료]
     **/
    @Auth
    @CafeAuth  // 카페인증 되어야 누를수있음
    @PostMapping("/like")
    public ResponseEntity<ResponseDTO> postLike(
            @RequestBody PostLikeRequestDto likeRequestDto) {

        PostLikeResponseDto likeResponseDto = postService.likePost(likeRequestDto);

        responseDTO = new ResponseDTO("게시글 좋아요 반영 완료", "", HttpStatus.OK, likeResponseDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);

    }

    /**
     * 1-3. 선택한 게시글 (상세페이지) 조회
     **/

    @Auth
    @PostMapping("/detail")
    public ResponseEntity<ResponseDTO> postDetail(@RequestParam Long postId) {
        PostDetailResponseDto detailResponseDto = postService.findOnePost(postId);
        responseDTO = new ResponseDTO("조회 완료!", "", HttpStatus.OK, detailResponseDto);
        List<CommentPagingResponseDto> responseDtoList = commentService.feedComment(new CommentPagingRequestDto(detailResponseDto.getPostId(), -1L));
        detailResponseDto.updateComment(responseDtoList);
        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 1-4. 글쓰기 클릭  [테스트완료]
     **/
    @Auth
    @CafeAuth
    @PostMapping("/write")
    public ResponseEntity<ResponseDTO> postWrite() {

        responseDTO = new ResponseDTO("카페 인증된 유저!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);

    }

    /**
     * 1-5. 업데이트 하러가기
     **/
    @Auth
//    @CafeAuth
    @PutMapping("/update")
    public ResponseEntity<ResponseDTO> updatePost(@RequestParam Long postId) {

        PostUpdateResponseDto postUpdateResponseDto = postService.updatePost(postId);
        responseDTO = new ResponseDTO("글 불러오기 완료!", "", HttpStatus.OK, postUpdateResponseDto);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @Auth
    @PostMapping("/search")
    public ResponseEntity<ResponseDTO> searchPost(
            @RequestBody PostSearchRequestDto requestDto,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        List<PostSearchResponseDto> responseDtoList = postService.searchPost(requestDto, pageable);
        responseDTO
                = new ResponseDTO("search feed 생성 성공!", "", HttpStatus.OK, responseDtoList);

        // 리턴객체 : 유저정보(카페로고, 닉네임, 칭호, 카페이름), 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수, 게시물 PK

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

}


