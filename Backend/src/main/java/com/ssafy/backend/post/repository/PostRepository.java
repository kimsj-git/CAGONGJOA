package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
//    Optional<Post> findByMemberId(Long memberId);

    @Query("SELECT p from Post p left join p.postCafeList pc where p.id < :id and p.postType in :types and pc.id in :cafeIdList")
    Slice<Post> findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(@Param("id") Long id, @Param("types")List<PostType> types, @Param("cafeIdList")List<Long> cafeIdList, Pageable pageable);

    @Query("SELECT p from Post p left join p.postCafeList pc where p.postType in :types and pc.id in :cafeIdList")
    Slice<Post> findAllByPostTypeInAndPostCafeList_CafeIdIn(@Param("types")List<PostType> types, @Param("cafeIdList")List<Long> cafeIdList, Pageable pageable);

    @Query("SELECT distinct p FROM Post p left join p.postLikeList pl left join p.postCafeList pc where pl.size > 10 and pc.cafe.id in :cafeIdList")
    Slice<Post> findHotPost(@Param("cafeIdList")List<Long> cafeIdList, Pageable pageable);

    @Query("SELECT distinct p FROM Post p left join p.postLikeList pl left join p.postCafeList pc where p.id < :postId and pl.size > 10 and pc.cafe.id in :cafeIdList")
    Slice<Post> findHotPostNext(@Param("cafeIdList") List<Long> cafeIdList, @Param("postId") Long postId, Pageable pageable);

    @Query("Select p from Post p left join p.postCafeList pc where p.id < :postId and p.content like %:searchKey% and pc.id in :cafeIdList")
    List<Post> findBySearchContentNext(@Param("cafeIdList") List<Long> cafeIdList, @Param("searchKey") String searchKey, @Param("postId") Long postId, Pageable pageable);

    @Query("Select p from Post p left join p.postCafeList pc where p.content like %:searchKey% and pc.id in :cafeIdList")
    List<Post> findBySearchContentFirst(@Param("cafeIdList") List<Long> cafeIdList, @Param("searchKey") String searchKey, Pageable pageable);

    @Query("Select p from Post p left join p.postCafeList pc where p.member.nickname like %:searchKey% and pc.id in :cafeIdList")
    List<Post> findBySearchNicknameFirst(@Param("cafeIdList") List<Long> cafeIdList, @Param("searchKey") String searchKey, Pageable pageable);

    @Query("Select p from Post p left join p.postCafeList pc where p.id < :postId and p.member.nickname like %:searchKey% and pc.id in :cafeIdList")
    List<Post> findBySearchNicknameNext(@Param("cafeIdList") List<Long> cafeIdList, @Param("searchKey") String searchKey, @Param("postId") Long postId, Pageable pageable);

    @Query("select p from Post p left join p.member m where p.id < :postId and m.id = :memberId")
    List<Post> findAllMyFeed(@Param("postId") Long postId, @Param("memberId") Long memberId, Pageable pageable);

}
