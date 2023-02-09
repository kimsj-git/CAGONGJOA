package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostLike;
import com.ssafy.backend.post.domain.enums.PostType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
//    Optional<Post> findByMemberId(Long memberId);

    Slice<Post> findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(Long id, List<PostType> types, List<Long> cafeIdList, Pageable pageable);

    Slice<Post> findAllByPostTypeInAndPostCafeList_CafeIdIn(List<PostType> types, List<Long> cafeIdList, Pageable pageable);

    @Query("SELECT distinct p FROM Post p left join p.postLikeList pl left join p.postCafeList pc where pl.size > 10 and pc.cafe.id in :cafeIdList")
    Slice<Post> findHotPost(@Param("cafeIdList")List<Long> cafeIdList, Pageable pageable);

    @Query("SELECT distinct p FROM Post p left join p.postLikeList pl left join p.postCafeList pc where p.id < :postId and pl.size > 10 and pc.cafe.id in :cafeIdList")
    Slice<Post> findHotPostNext(@Param("cafeIdList") List<Long> cafeIdList, @Param("postId") Long postId, Pageable pageable);

}
