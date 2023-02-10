package com.ssafy.backend.cafe.repository;

import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public interface CafeCrowdRepository extends JpaRepository<CafeCrowd, Long> {
    List<CafeCrowd> findAllByCreatedAtBetweenAndCafeId(LocalDateTime start, LocalDateTime end, long cafeId);
}
