package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FortuneRepository extends JpaRepository<Fortune, Long> {


}
