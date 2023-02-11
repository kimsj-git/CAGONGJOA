package com.ssafy.backend.post.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.service.CommentService;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("main/postDetail")
@RequiredArgsConstructor
public class PostDetailController {

    private final CommentService commentService;
    private ResponseDTO responseDTO;
    private final PostService postService;

    /**
     * 2-1. 댓글 더보기
     **/

    @Auth
    @GetMapping("/comment/feed")
    public ResponseEntity<ResponseDTO> feedComment(
            @RequestBody CommentPagingRequestDto requestDto) throws Exception {

        List<CommentPagingResponseDto> comments = commentService.feedComment(requestDto);

        responseDTO = new ResponseDTO("댓글 불러오기 완료!", "", HttpStatus.OK, comments);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 2-2. 댓글 작성 (완료)
     **/

    @Auth
    @CafeAuth
    @PostMapping("/comment/write")
    public ResponseEntity<ResponseDTO> commentWrite(
            @RequestBody CommentWriteRequestDTO commentWriteDto) {

        Long commetId = commentService.writeComment(commentWriteDto);

        responseDTO = new ResponseDTO("댓글 생성 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 2-3. 댓글 좋아요 누르기 (완료)
     **/
    @Auth
    @CafeAuth
    @PutMapping("/comment/like")
    public ResponseEntity<ResponseDTO> commentLike(@RequestBody CommentLikeRequestDto requestDto) {

        CommentLikeResponseDto commentLikeResponseDto = commentService.likeComment(requestDto);
        if (commentLikeResponseDto.isChecked()) {
            responseDTO = new ResponseDTO("댓글 좋아요처리 생성 완료!", "", HttpStatus.OK, commentLikeResponseDto);
        } else {
            responseDTO = new ResponseDTO("댓글 좋아요처리 삭제 완료!", "", HttpStatus.OK, commentLikeResponseDto);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 2-4. 댓글 수정
     **/

    @Auth
    @CafeAuth
    @PutMapping("/comment/update")
    public ResponseEntity<ResponseDTO> commentUpdate(@RequestBody CommentUpdateRequestDTO commentUpdateDto) {

        commentService.updateComment(commentUpdateDto);

        responseDTO = new ResponseDTO("댓글 수정 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 2-5. 댓글 삭제
     **/

    @Auth
    @CafeAuth
    @DeleteMapping("/comment/delete")

    public ResponseEntity<ResponseDTO> deleteComment(@RequestParam Long commentId) {

        commentService.deleteComment(commentId);

        responseDTO = new ResponseDTO("댓글 삭제 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 2-6. 글 삭제
     **/

    @Auth
    @CafeAuth
    @DeleteMapping("/delete")

    public ResponseEntity<ResponseDTO> deletePost(@RequestParam Long postId) {

        postService.deletePost(postId);
        responseDTO = new ResponseDTO("게시글 삭제 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


}
