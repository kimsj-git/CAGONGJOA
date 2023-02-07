package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.Inet4Address;
import java.util.Optional;

public interface CafeVisitLogRepository extends JpaRepository<CafeVisitLog, Long> {
    Optional<CafeVisitLog> findByMemberIdAndCafeId(Long memberId, Long cafeId);

    Optional<CafeVisitLog> findByVisitedAt(Integer visitedAt);
}