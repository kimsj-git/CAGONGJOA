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

    /**  2-1. 댓글 더보기  **/

    @Auth
    @GetMapping("/comment/feed")
    public ResponseEntity<ResponseDTO> feedComment(
            @RequestBody CommentPagingRequestDto requestDto) throws Exception {

        List<CommentPagingResponseDto> comments = commentService.feedComment(requestDto);

        responseDTO = new ResponseDTO("댓글 불러오기 완료!", "", HttpStatus.OK, comments);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**  2-2. 댓글 작성 (완료) **/

    @Auth
    @CafeAuth
    @PostMapping("/comment/write")
    public ResponseEntity<ResponseDTO> commentWrite(
            @RequestBody CommentWriteRequestDTO commentWriteDto) throws Exception {

        int result = commentService.writeComment(commentWriteDto);
        if(result == 1) {
            responseDTO = new ResponseDTO("", "글쓰는 도중 post 가 사라짐", HttpStatus.OK, null);
        }else if(result == 2) {
            responseDTO = new ResponseDTO("댓글 생성 완료!", "", HttpStatus.OK, null);
        }else {
            responseDTO = new ResponseDTO("", "의문의 에러 발생", HttpStatus.OK, null);
        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**  2-3. 댓글 좋아요 누르기 (완료) **/
    @PutMapping("/comment/like")
    public ResponseEntity<ResponseDTO> commentLike(@RequestBody CommentLikeRequestDto requestDto) throws Exception {

        CommentLikeResponseDto commentLikeResponseDto = commentService.likeComment(requestDto);
        if(commentLikeResponseDto.isChecked()) {
            responseDTO = new ResponseDTO("댓글 좋아요처리 생성 완료!", "", HttpStatus.OK, commentLikeResponseDto);
        }else {
            responseDTO = new ResponseDTO("댓글 좋아요처리 삭제 완료!", "", HttpStatus.OK, commentLikeResponseDto);
        }

        return new ResponseEntity<>(responseDTO,HttpStatus.OK);
    }

    /**  2-4. 댓글 수정 **/

    @Auth
    @CafeAuth
    @PutMapping("/comment/update")
    public ResponseEntity<ResponseDTO> commentUpdate(@RequestBody CommentUpdateRequestDTO commentUpdateDto) throws Exception {

        int result = commentService.updateComment(commentUpdateDto);

        if(result == 1) {
            responseDTO = new ResponseDTO("", "잘못된 comment Id!", HttpStatus.OK, null);
        }else if(result == 2) {
            responseDTO = new ResponseDTO("", "user 정보가 글쓴이 정보와 맞지않음", HttpStatus.OK, null);
        }else if(result == 3){
            responseDTO = new ResponseDTO("", "컨텐트값은 null이면 안됨!", HttpStatus.OK, null);
        }else if(result == 4){
            responseDTO = new ResponseDTO("댓글 수정 완료!", "", HttpStatus.OK, null);
        }else {
            responseDTO = new ResponseDTO("", "unKnown Error", HttpStatus.OK, null);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**  2-5. 댓글 삭제   **/

    @Auth
    @CafeAuth
    @DeleteMapping("/comment/delete")

    public ResponseEntity<ResponseDTO> deleteComment(@RequestParam Long commentId) throws Exception {

        int result = commentService.deleteComment(commentId);
        if(result == 1) {
            responseDTO = new ResponseDTO("", "댓글 id를 잘못줬어", HttpStatus.BAD_REQUEST, null);
        }else if(result == 2){
            responseDTO = new ResponseDTO("댓글 삭제 완료!", "", HttpStatus.OK, null);
        }else if (result == 3){
            responseDTO = new ResponseDTO("", "401 error 유저 <> 글쓴이 확인필요", HttpStatus.UNAUTHORIZED, null);
        }else {
            responseDTO = new ResponseDTO("", "Unknown Error", HttpStatus.UNAUTHORIZED, null);
        }
        return new ResponseEntity<>(responseDTO,HttpStatus.OK);
    }

}
