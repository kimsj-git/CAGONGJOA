package com.ssafy.backend.todaycafe.domain.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CafeVisitLogRepository extends JpaRepository<CafeVisitLog, Long> {
    Optional<CafeVisitLog> findByMemberIdAndCafeId(Long memberId, Long cafeId);
}