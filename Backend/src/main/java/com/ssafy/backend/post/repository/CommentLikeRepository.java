package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    void deleteByCommentIdAndMemberId(Long commentId, Long memberId);

    Integer countCommentLikeByCommentId(Long commentId);

    Optional<CommentLike> findByCommentIdAndMemberId(Long commentId, Long memberId);
}
