package com.ssafy.backend.redis;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CafeAuthRepository extends CrudRepository<CafeAuth, String> {
}
