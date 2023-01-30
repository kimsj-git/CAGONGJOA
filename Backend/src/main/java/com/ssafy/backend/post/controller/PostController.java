package com.ssafy.backend.post.controller;

import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    /**  1. 글쓰기 클릭  **/
    @PostMapping("/write")
    // @Auth   // 유저인증 - interceptor에서 거름
    public ResponseEntity<Void> postWrite(@RequestParam String memberNickname) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**  2. 게시글 입력   **/

    @PostMapping("/writeForm")
    // @Auth

    // 2. 글 정보 확인

    // 3. 글쓰기
    public ResponseEntity<Void> postWriteForm(@RequestBody PostWriteFormRequestDto requestPostDto) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        postService.writePost(requestPostDto);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    /**  3. 게시글 수정하기 클릭   **/
    @PostMapping("/update")
    // @Auth

    public ResponseEntity<Void> updatePost(@RequestParam String memberNickname) throws Exception {

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  4. 게시글 수정   **/
    @PostMapping("/updateForm")
    // @Auth

    public ResponseEntity<Void> postUpdateForm(@RequestBody PostWriteFormRequestDto requestPostDto) throws Exception {

        postService.updatePost(requestPostDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  5. 선택한 게시글 (1개) 조회   **/


    @PostMapping("/{post_id}")
    // @Auth
    public ResponseEntity<Void> postFindOne(@RequestParam Long postId) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        postService.findOnePost(postId);

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  6. 게시글 (10개씩) 조회  (피드)  **/


    @PostMapping("/feed")
    // @Auth
    public ResponseEntity<Void> postFeed(@RequestParam Long memberId) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**  7. 게시글 전체 조회 (마이페이지) - 아직안됨  **/


    // 3. 게시글 조회
    @PostMapping("/findAll")
    // @Auth
    public ResponseEntity<Map<String, Object>> postFindAll(@RequestParam Long memberId) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        postService.findAllPost(memberId);

        // 유저에게 게시글 내용을 보여주기
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**  8. 게시글 삭제   **/

    @PostMapping("/delete")
    // @Auth

    public ResponseEntity<Void> deletePost(@RequestParam Long postId) throws Exception {

        postService.deletePost(postId);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    // 3. 지정된 분량 만큼의 게시글의 목록을 반환한다
//    @GetMapping
//    public ResponseEntity<List<BoardListDto>> listArticle(BoardParameterDto boardParameterDto)  {
//        return new ResponseEntity<>(boardService.listArticle(boardParameterDto), HttpStatus.OK);
//    }

    // 4. 글번호에 해당 하는 게시글의 정보를 반환
//    @Auth
//    @GetMapping("/{id}")
//    public ResponseEntity<BoardViewDto> getArticle(@PathVariable("id") int id)  {
//        return new ResponseEntity<>(boardService.getArticle(id), HttpStatus.OK);
//    }

    // 5. 게시글 수정


    // 6. 글번호에 해당하는 게시글의 정보를 삭제
//    @Auth
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteArticle(@PathVariable("id") int id)  {
//        boardService.deleteArticle(id);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    // 7. 게시판 댓글 작성
//    @Auth
//    @PostMapping("/comment")
//    public ResponseEntity<Void> writeComment(@RequestBody CommentDto commentDto)  {
//        boardService.writeComment(commentDto);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    // 8. 현재 게시글 id에 해당하는 댓글들 가져오기
//    @GetMapping("/{postId}/comment")
//    public ResponseEntity<List<CommentDto>> getComments(@PathVariable("postId") int postId) {
//        return new ResponseEntity<>(boardService.getComments(postId), HttpStatus.OK);
//    }

    // 9. 글번호에 해당하는 게시글의 정보를 삭제
//    @Auth
//    @DeleteMapping("/comment/{commentId}")
//    public ResponseEntity<Void> deleteComment(@PathVariable("commentId") int commentId)  {
//        boardService.deleteComment(commentId);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    // 10. 글 번호에 해당하는 게시글의 정보를 수정
//    @Auth
//    @PutMapping("/comment")
//    public ResponseEntity<Void> modifyComment(@RequestBody CommentDto commentDto)  {
//        boardService.modifyComment(commentDto);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

}
