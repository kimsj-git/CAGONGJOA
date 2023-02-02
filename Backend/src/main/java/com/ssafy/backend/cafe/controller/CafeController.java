package com.ssafy.backend.cafe.controller;

import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import com.ssafy.backend.cafe.service.CafeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/cafe")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;

    @PostMapping
    public ResponseEntity<Void> getNearByCafes(@RequestBody ClientPosInfoDto clientPosInfo) {
        System.out.println("clientPosInfo = " + clientPosInfo);
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfo);
        System.out.println("nearByCafeLocations = " + nearByCafeLocations);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
