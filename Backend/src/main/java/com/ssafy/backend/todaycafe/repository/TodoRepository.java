package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.todaycafe.domain.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

//    @Query("SELECT t FROM Todo t left join t.cafeVisitLog cv WHERE cv.id = :cafeVisitId")
    List<Todo> findAllByCafeVisitLogId(Long cafeVisitId);

}
