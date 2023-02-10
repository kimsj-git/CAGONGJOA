package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.net.Inet4Address;
import java.util.List;
import java.util.Optional;

public interface CafeVisitLogRepository extends JpaRepository<CafeVisitLog, Long> {
    Optional<CafeVisitLog> findByVisitedAtAndMemberIdAndCafeId(Integer visitedAt, Long memberId, Long cafeId);

    // 카페일지 + 운세 가져오기
//    @Query("SELECT c FROM CafeVisitLog c WHERE c.member.id = :memberId AND CONCAT(c.visitedAt, '') LIKE %:ymDate%")
//    List<CafeVisitLog> findByMemberIdAndContaining(@Param("memberId") long memberId, @Param("ymDate") int ymDate);
//    List<CafeVisitLog> findAllByMemberIdAndVisitedAtStartingWith(Long member_id, int visitedAt);

    @Query("SELECT c FROM CafeVisitLog c WHERE CONCAT(c.visitedAt, '') LIKE %:ymDate% AND c.member.id = :memberId")
    List<CafeVisitLog> findByVisitedAtLikeAndMemberId(@Param("memberId") long memberId, @Param("ymDate") String ymDate);

    List<CafeVisitLog> findByVisitedAtAndMemberId(int visitedAt, Long memberId);
}
