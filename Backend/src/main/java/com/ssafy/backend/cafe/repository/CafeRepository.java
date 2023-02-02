package com.ssafy.backend.cafe.repository;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeRepository extends JpaRepository<Cafe, Long> {
}
