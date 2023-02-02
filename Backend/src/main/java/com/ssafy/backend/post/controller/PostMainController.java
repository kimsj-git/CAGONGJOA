package com.ssafy.backend.post.controller;


import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.post.domain.dto.PostPagingRequestDto;
import com.ssafy.backend.post.domain.dto.PostPagingResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.util.*;
import java.util.function.Function;

@RestController
@RequestMapping("main/post")
@RequiredArgsConstructor

public class PostMainController {
    private final PostService postService;


//    @PostMapping("/imgtest")
//    public ResponseEntity<Object> upload(@RequestBody MultipartFile[] multipartFileList) throws Exception {
//
//        List<String> imagePathList = postService.imgTest(multipartFileList);
//        System.out.println(imagePathList);
//        return new ResponseEntity<Object>(imagePathList, HttpStatus.OK);
//    }


    /**  1-1. 메인페이지 글목록 주기 **/

//    @Auth
    @GetMapping("/feed")
    public ResponseEntity<Slice<Post>> postMain(@RequestParam Long postId, @PageableDefault(size=10,sort = "id",direction = Sort.Direction.DESC) Pageable pageable) throws Exception {

        Slice<Post> postSlice = postService.findAllPost(postId, pageable);

        System.out.println(postSlice.getContent());

        // 리턴객체 : 유저정보(카페로고, 닉네임, 칭호, 카페이름), 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수, 게시물 PK

        return new ResponseEntity<>(postSlice,HttpStatus.OK);
    }

    /**  1-2. 다음페이지 주기 **/

//    @Auth
    @GetMapping("/feed/next")
    public ResponseEntity<Void> nextPost() throws Exception {

        postService.nextPost();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  1-3. 게시글 좋아요 누르기  [테스트완료] **/
//    @Auth
    @PostMapping("/like")
    public ResponseEntity<Void> postLike(@RequestParam Long postId, @RequestParam Boolean isChecked) throws Exception {

        Map.Entry<Boolean, Long> postLikeResult = postService.likePost(postId, isChecked);
        Boolean responseIsChecked = postLikeResult.getKey();
        Long responsePostId = postLikeResult.getValue();
        System.out.println("Controller - postlike - " + responseIsChecked + " " + responsePostId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  1-4. 선택한 게시글 (상세페이지) 조회   **/

//    @Auth
    @PostMapping("/detail")
    public ResponseEntity<Void> postDetail(@RequestParam Long postId, @RequestParam String nickname) throws Exception {
        postService.findOnePost(postId, nickname);

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }



    /**  1-5. 글쓰기 클릭  [테스트완료] **/
//    @Auth
    @PostMapping ("/write")
    public ResponseEntity<Void> postWrite(@RequestParam String memberNickname) throws Exception {

        postService.checkMember();

        return new ResponseEntity<>(HttpStatus.OK);

    }


}
