package com.ssafy.backend.cafe.repository;

import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public interface CafeCrowdRepository extends JpaRepository<CafeCrowd, Long> {
    List<CafeCrowd> findAllByCreatedAtBetweenAndCafeId(LocalDateTime start, LocalDateTime end, long cafeId);

    @Query("select c from CafeCrowd c where c.cafe.id in :cafeIds and c.createdAt between :startTime and :endTime")
    List<CafeCrowd> fineByCafeIds(@Param("cafeIds") List<Long> cafeIdList,
                                  @Param("startTime") LocalDateTime startTime,
                                  @Param("endTime") LocalDateTime endTime);

//    @Query("SELECT p FROM <YourEntity> p WHERE p.timestamp BETWEEN :startTime AND :endTime AND p.field IN (:fieldValues)")
//    List<YourEntity> findByTimeRangeAndFieldValues(@Param("startTime") LocalDateTime startTime,
//                                                   @Param("endTime") LocalDateTime endTime,
//                                                   @Param("fieldValues") List<String> fieldValues);

}
