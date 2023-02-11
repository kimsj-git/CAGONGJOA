package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    void deleteByCommentIdAndMemberId(long commentId, long memberId);

    Integer countCommentLikeByCommentId(long commentId);

    Optional<CommentLike> findByCommentIdAndMemberId(Long commentId, long memberId);
}
