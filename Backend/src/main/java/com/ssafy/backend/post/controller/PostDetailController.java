package com.ssafy.backend.post.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.post.domain.dto.CommentPagingRequestDto;
import com.ssafy.backend.post.domain.dto.CommentUpdateRequestDTO;
import com.ssafy.backend.post.domain.dto.CommentWriteRequestDTO;
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

import java.util.Map;

@RestController
@RequestMapping("main/postDetail")
@RequiredArgsConstructor
public class PostDetailController {

    private final PostService postService;
    private final CommentService commentService;
    private ResponseDTO responseDTO;

    /**  2-1. 댓글 더보기  (보류) **/

    @Auth
    @GetMapping("/comment/feed")
    public ResponseEntity<ResponseDTO> nextComment(
            @RequestBody CommentPagingRequestDto requestDto,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) throws Exception {

        Slice<Comment> comments = commentService.feedComment(requestDto, pageable);

        responseDTO = new ResponseDTO("댓글 불러오기 완료!", "", HttpStatus.OK, comments);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**  2-2. 댓글 작성 (테스트필요) **/

    @Auth
    @PostMapping("/comment/write")
    public ResponseEntity<ResponseDTO> commentWrite(
            @RequestBody CommentWriteRequestDTO commentWriteDto) throws Exception {

        commentService.writeComment(commentWriteDto);

        responseDTO = new ResponseDTO("댓글 작성 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**  2-3. 댓글 좋아요 누르기 (테스트필요) **/
    @PostMapping("/comment/like")
    public ResponseEntity<Void> commentLike(@RequestParam Long commentId, @RequestParam Boolean isChecked) throws Exception {

        Map.Entry<Boolean, Long> postLikeResult = commentService.likeComment(commentId, isChecked);
        Boolean responseIsChecked = postLikeResult.getKey();
        Long responseCommentId = postLikeResult.getValue();
        System.out.println("Controller - commentLike - " + responseIsChecked + " " + responseCommentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-4. 댓글 수정 **/

    @Auth
    @GetMapping("/comment/update")
    public ResponseEntity<Void> commentUpdate(CommentUpdateRequestDTO commentUpdateDto) throws Exception {

        commentService.updateComment(commentUpdateDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-5. 댓글 삭제   **/

    @Auth
    @DeleteMapping("/comment/delete")

    public ResponseEntity<ResponseDTO> deleteComment(@RequestParam Long commentId) throws Exception {

        if(commentService.deleteComment(commentId)) {
            responseDTO = new ResponseDTO("댓글 삭제 완료!", "", HttpStatus.OK, null);
        }else {
            responseDTO = new ResponseDTO("", "401 error 유저 <> 글쓴이 확인필요", HttpStatus.UNAUTHORIZED, null);
        }
        return new ResponseEntity<>(responseDTO,HttpStatus.OK);
    }

}
