package com.ssafy.backend.member.repository;

import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberCafeTierRepository extends JpaRepository<MemberCafeTier, Long> {
    Optional<MemberCafeTier> findByMemberIdAndCafeId(Long memberId, Long cafeId);
}
