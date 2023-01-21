package com.ssafy.backend.user.repository;

import com.ssafy.backend.user.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
