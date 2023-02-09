package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    void deleteByCommentIdAndMemberId(long commentId, long memberId);

    Integer countCommentLikeByCommentId(long commentId);

}
