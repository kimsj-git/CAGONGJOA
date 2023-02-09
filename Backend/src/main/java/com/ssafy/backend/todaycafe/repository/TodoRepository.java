package com.ssafy.backend.todaycafe.repository;

import com.ssafy.backend.todaycafe.domain.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t WHERE t.cafeVisitLog.id = :cafeVisId")
    List<Todo> findTodoByIdCafeVisitId(@Param("cafeVisId") Long cafeVisId);
}
