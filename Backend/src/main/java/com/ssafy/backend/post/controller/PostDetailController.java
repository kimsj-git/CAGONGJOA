package com.ssafy.backend.post.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.post.domain.dto.CommentUpdateRequestDTO;
import com.ssafy.backend.post.domain.dto.CommentWriteRequestDTO;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("main/postDetail")
@RequiredArgsConstructor
public class PostDetailController {

    private final PostService postService;

    /**  2-1. 댓글 더보기 **/

    @Auth
    @GetMapping("/comment/next")
    public ResponseEntity<Void> nextComment() throws Exception {

        // 여기에요

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-2. 댓글 작성 (테스트필요) **/

    @Auth
    @GetMapping("/comment/write")
    public ResponseEntity<Void> commentWrite(@RequestBody CommentWriteRequestDTO commentWriteDto) throws Exception {


        postService.writeComment(commentWriteDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**  2-3. 댓글 좋아요 누르기 (테스트필요) **/
    @PostMapping("/comment/like")
    public ResponseEntity<Void> commentLike(@RequestParam Long commentId, @RequestParam Boolean isChecked) throws Exception {

        Map.Entry<Boolean, Long> postLikeResult = postService.likeComment(commentId, isChecked);
        Boolean responseIsChecked = postLikeResult.getKey();
        Long responseCommentId = postLikeResult.getValue();
        System.out.println("Controller - commentLike - " + responseIsChecked + " " + responseCommentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-4. 댓글 수정 **/

    @Auth
    @GetMapping("/comment/update")
    public ResponseEntity<Void> commentUpdate(CommentUpdateRequestDTO commentUpdateDto) throws Exception {

        postService.updateComment(commentUpdateDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-5. 댓글 삭제   **/

    @Auth
    @PostMapping("/comment/delete")

    public ResponseEntity<Void> deleteComment(@RequestParam Long commentId) throws Exception {

        postService.deletecomment(commentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  2-6. 게시글 수정 페이지로 이동  **/
    @PutMapping("/update")
    @Auth
    public ResponseEntity<Void> updatePost(@RequestParam String nickname, Long postId) throws Exception {

        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**  2-7. 게시글 삭제   **/

    @Auth
    @PostMapping("/delete")

    public ResponseEntity<Void> deletePost(@RequestParam Long postId) throws Exception {

        postService.deletePost(postId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
