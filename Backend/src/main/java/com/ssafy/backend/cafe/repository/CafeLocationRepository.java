package com.ssafy.backend.cafe.repository;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CafeLocationRepository extends JpaRepository<CafeLocation, Long> {
    List<CafeLocation> findAllByIdIn(List<Long> cafeIdList);

    Optional<CafeLocation> findByLatAndLng(Double lat, Double lng);

    Optional<CafeLocation> findByCafeId(long cafeId);
}
