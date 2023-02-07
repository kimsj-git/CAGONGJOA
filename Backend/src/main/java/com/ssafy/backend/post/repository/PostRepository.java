package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByMemberId(Long memberId);

    Slice<Post> findAllByIdLessThanAndMemberIdAndPostTypeIn(Long postId, Long memberId, @Param("type") List<PostType> types, Pageable pageable);

    Slice<Post> findAllByMemberIdAndPostTypeIn(Long memberId, @Param("type") List<PostType> types, Pageable pageable);


    // 핫게시물 구현

}
