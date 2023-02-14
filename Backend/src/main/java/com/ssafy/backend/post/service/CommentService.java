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

    List<CommentPagingResponseDto> feedComment(CommentPagingRequestDto requestDto);


    CommentPagingResponseDto writeComment(CommentWriteRequestDTO commentWriteDto);

    /** 2. 댓글 수정 **/
    void updateComment(CommentUpdateRequestDTO commentUpdateDto);
    /** 3. 댓글 페이징 조회 **/

    /** 4. 댓글 삭제 **/
    void deleteComment(Long commentId);

    /** 5. 댓글 좋아요 **/
    CommentLikeResponseDto likeComment(CommentLikeRequestDto requestDto);

}
