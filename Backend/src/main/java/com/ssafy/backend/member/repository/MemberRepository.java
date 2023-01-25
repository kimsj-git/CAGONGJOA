package com.ssafy.backend.member.repository;

import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.enums.OauthType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByOauthIdAndOauthType(Long oauthId, OauthType oAuthType);

    Optional<Member> findByNickname(String nickName);

}
