package com.ssafy.backend.member.repository;

import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import com.ssafy.backend.member.domain.enums.OauthType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberCoinRepository extends JpaRepository<MemberCoin, Long> {

    Optional<MemberCoin> findByMemberId(Long memberId);
}
