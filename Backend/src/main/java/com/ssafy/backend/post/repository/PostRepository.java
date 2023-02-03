package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.dto.PostPagingResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByMemberId(Long memberId);

    Slice<PostPagingResponseDto> findAllByIdLessThanAndMemberId(Long postId, Long memberId, List<String> types, Pageable pageable);

    Slice<PostPagingResponseDto> findAllByMemberId(Long memberId, List<String> types, Pageable pageable);


    // 핫게시물 구현

}
