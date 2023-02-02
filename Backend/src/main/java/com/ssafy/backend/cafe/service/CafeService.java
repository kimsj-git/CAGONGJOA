package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;

import java.util.List;

public interface CafeService {
    List<NearByCafeResultDto> getNearByCafeLocations(ClientPosInfoDto clientPosInfoDto);
}
