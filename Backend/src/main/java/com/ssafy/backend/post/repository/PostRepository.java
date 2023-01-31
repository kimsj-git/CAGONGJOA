package com.ssafy.backend.post.repository;


import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.post.domain.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByMemberId(Long memberId);

    Optional<Member> findByNickname(String nickname);
}
