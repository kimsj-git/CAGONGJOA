package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
//    Optional<Post> findByMemberId(Long memberId);

    Slice<Post> findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(Long id, List<PostType> types, List<Long> cafeIdList, Pageable pageable);

    Slice<Post> findAllByPostTypeInAndPostCafeList_CafeIdIn(List<PostType> types, List<Long> cafeIdList, Pageable pageable);

    Slice<Post> findAllByPostLikeList(List<Long> cafeIdList, Pageable pageable);

}
