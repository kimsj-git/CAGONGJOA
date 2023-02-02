package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface PostService {

    public long userTest() throws Exception;

    /** 0. 유저 확인  **/
    public Map.Entry<Long, Boolean> checkMember() throws Exception;

    /** 1. 게시글 등록  **/
    boolean writePost(PostWriteFormRequestDto postDto) throws Exception;

    /** 2. 게시글 수정 **/
    void updatePost(PostUpdateFormRequestDto postDto) throws Exception;

    /** 3. 게시글 삭제  **/
    void deletePost(Long postId) throws Exception;

    /** 4. 게시글 1개 조회  **/
    void findOnePost(Long postId, String nickname) throws Exception;

    /** 5. 게시글 전부 조회  **/
    Slice<Post> findAllPost(Long postId, Pageable pageable) throws Exception;

    /** 6. 게시글 페이징 10개씩  **/


    /** 7. 게시글 좋아요  **/
    Map.Entry<Boolean, Long> likePost(Long postId,Boolean isChecked) throws Exception;



    /** 댓글  **/

    /** 1. 댓글 쓰기 **/
    void writeComment(CommentWriteRequestDTO commentWriteDto) throws Exception;

    /** 2. 댓글 수정 **/
    void updateComment(CommentUpdateRequestDTO commentUpdateDto) throws Exception;
    /** 3. 댓글 페이징 조회 **/

    /** 4. 댓글 삭제 **/
    void deletecomment(Long commentId) throws Exception;

    /** 5. 댓글 좋아요 **/
    Map.Entry<Boolean, Long> likeComment(Long commentId,Boolean isChecked) throws Exception;


    /** 다음글 주기 **/
    void nextPost();


}
