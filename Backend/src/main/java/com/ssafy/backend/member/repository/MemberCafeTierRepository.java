package com.ssafy.backend.member.repository;

import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberCafeTierRepository extends JpaRepository<MemberCafeTier, Long> {
}
