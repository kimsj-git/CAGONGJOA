package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;
import java.util.Map;

public interface CommentService {


    /** 댓글  **/

    /** 1. 댓글 불러오기 **/

    List<CommentPagingResponseDto> feedComment(CommentPagingRequestDto requestDto) throws Exception;


    int writeComment(CommentWriteRequestDTO commentWriteDto) throws Exception;

    /** 2. 댓글 수정 **/
    int updateComment(CommentUpdateRequestDTO commentUpdateDto) throws Exception;
    /** 3. 댓글 페이징 조회 **/

    /** 4. 댓글 삭제 **/
    int deleteComment(Long commentId) throws Exception;

    /** 5. 댓글 좋아요 **/
    CommentLikeResponseDto likeComment(CommentLikeRequestDto requestDto) throws Exception;

}
