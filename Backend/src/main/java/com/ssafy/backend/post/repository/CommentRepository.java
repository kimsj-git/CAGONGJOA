package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Optional<Comment> findTopByPostIdOrderByIdDesc(Long postId);

    Slice<Comment> findAllByGroupNoInAndPostId(Set<Long> groupSet, Long postId);

    void deleteAllByGroupNo(Long groupNo);

    List<Comment> findAllByPostId(Long postId);

    Slice<Comment> findAllByIdLessThanAndMemberId(Long commentId, Long memberId, Pageable pageable);

    Optional<Comment> findTopByPostIdAndGroupNoOrderByIdDesc(Long postId, Long groupNo);
}
