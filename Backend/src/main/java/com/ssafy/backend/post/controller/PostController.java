package com.ssafy.backend.post.controller;


import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.post.domain.dto.PagingRequestDto;
import com.ssafy.backend.post.domain.dto.PostPagingResponseDto;
import com.ssafy.backend.post.domain.dto.PostUpdateFormRequestDto;
import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;



//    @PostMapping("/imgtest")
//    public ResponseEntity<Object> upload(@RequestBody MultipartFile[] multipartFileList) throws Exception {
//
//        List<String> imagePathList = postService.imgTest(multipartFileList);
//        System.out.println(imagePathList);
    //        return new ResponseEntity<Object>(imagePathList, HttpStatus.OK);
//    }

    @Auth
    @PostMapping("/usertest")
    public ResponseEntity<Void> userTest() throws Exception {

        long memberId = postService.userTest();
        System.out.println(memberId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }


    /**  1. 메인페이지 글목록 주기 **/

    @Auth
    @GetMapping("/main")
    public ResponseEntity<List<PostPagingResponseDto>> postMain(@RequestBody PagingRequestDto requestDto) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();
        postService.findAllPost(requestDto);

        // 리턴객체 : 유저정보(카페로고, 닉네임, 칭호, 카페이름), 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수, 게시물 PK


        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**  2. 선택한 게시글 (상세페이지) 조회   **/


    @Auth
    @PostMapping("/{postId}")
    public ResponseEntity<Void> postDetail(@RequestParam Long postId, @RequestParam String nickname) throws Exception {
        postService.findOnePost(postId, nickname);

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }



    /**  1. 글쓰기 클릭  **/
    @Auth
    @PostMapping ("/write")
    public ResponseEntity<Void> postWrite(@RequestParam String memberNickname) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();



        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**  2. 게시글 글쓰기 화면   **/

//    @Auth
    @PostMapping("/writeForm")
    public ResponseEntity<Void> postWriteForm(@RequestBody PostWriteFormRequestDto requestPostDto) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        if(postService.writePost(requestPostDto)) { // 위치인증된 유저
            return new ResponseEntity<>(HttpStatus.OK);
        }else { // 위치인증 되지 않은 유저
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }

    /**  3. 게시글 수정하기 클릭   **/
    @PutMapping("/update")
    @Auth
    public ResponseEntity<Void> updatePost(@RequestParam String nickname, Long postId) throws Exception {

        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  4. 게시글 수정   **/
    @Auth
    @PostMapping("/updateForm")

    public ResponseEntity<Void> postUpdateForm(@RequestBody PostUpdateFormRequestDto updateDto) throws Exception {

        postService.updatePost(updateDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }



    /**  6. 게시글 좋아요 누르기  **/
    //@Auth
    @PostMapping("/like")
    public ResponseEntity<Void> postLike(@RequestParam Long postId, @RequestParam Boolean isChecked) throws Exception {

        Map.Entry<Boolean, Long> postLikeResult = postService.likePost(postId, isChecked);
        Boolean responseIsChecked = postLikeResult.getKey();
        Long responsePostId = postLikeResult.getValue();
        System.out.println("Controller - postlike - " + responseIsChecked + " " + responsePostId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  7. 댓글 좋아요 누르기  **/
    @PostMapping("/comment/like")
    public ResponseEntity<Void> commentLike(@RequestParam Long commentId, @RequestParam Boolean isChecked) throws Exception {

        Map.Entry<Boolean, Long> postLikeResult = postService.likeComment(commentId, isChecked);
        Boolean responseIsChecked = postLikeResult.getKey();
        Long responseCommentId = postLikeResult.getValue();
        System.out.println("Controller - commentLike - " + responseIsChecked + " " + responseCommentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  8. 게시글 삭제   **/

    @Auth
    @PostMapping("/delete")

    public ResponseEntity<Void> deletePost(@RequestParam Long postId) throws Exception {

        postService.deletePost(postId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  8. 댓글 삭제   **/

    @Auth
    @PostMapping("/comment/delete")

    public ResponseEntity<Void> deleteComment(@RequestParam Long commentId) throws Exception {

        postService.deletecomment(commentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
