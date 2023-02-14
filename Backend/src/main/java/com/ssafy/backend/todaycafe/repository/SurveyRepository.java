package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.domain.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
    @Query("select s from Survey s where s.cafe.id = :cafeId and s.createdAt between :startTime and :endTime")
    List<Survey> findByCafeIdsAndTimeRange(@Param("cafeId") long cafeId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);
}
