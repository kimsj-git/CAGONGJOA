package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.CommentWriteFormRequestDTO;

public interface CommentService {

    /** 1. 댓글 등록  **/
    void writeComment(CommentWriteFormRequestDTO commentDTO) throws Exception;

    /** 2. 댓글 수정 **/
    void updateComment(CommentWriteFormRequestDTO commentDTO) throws Exception;

    /** 3. 댓글 삭제  **/
    void deleteComment(Long id) throws Exception;

    /** 4. 댓글 1개 조회  **/
    void findOneComment(Long id) throws Exception;

    /** 5. 댓글 전부 조회  **/
    void findAllComment(Long memberId) throws Exception;

    /** 6. 게시글 페이징  **/
//    PostPagingDto getPostList(Pageable pageable, PostSearchCondition postSearchCondition);

}
