package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByMemberId(Long memberId);

    Slice<Post> findAllByIdLessThanAndMemberId(Long postId, Long memberId, PostType[] types, Pageable pageable);

    Slice<Post> findAllByMemberId(Long memberId, PostType[] types, Pageable pageable);


    // 핫게시물 구현

}
