package com.ssafy.backend.cafe.controller;

import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.LocationDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import com.ssafy.backend.cafe.service.CafeService;
import com.ssafy.backend.common.dto.ResponseDTO;
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

    @PostMapping("/auth/select")
    public ResponseEntity<ResponseDTO> cafeAuth(@RequestBody Long cafeId) {


        ResponseDTO responseDTO
                = new ResponseDTO("위치 인증 완료!", "", HttpStatus.OK, null);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PostMapping("/auth")
    public ResponseEntity<ResponseDTO> cafeAuth(@RequestBody LocationDto locationDto) {

        final double DIST = 0.05; // 50m 반경에 해당하는 근거리 카페만 가져온다
        ClientPosInfoDto clientPosInfoDto
                = new ClientPosInfoDto(locationDto.getLatitude(), locationDto.getLongitude(), DIST);
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfoDto);

        ResponseDTO responseDTO
                = new ResponseDTO("카페 위치 인증 버튼 click", "", HttpStatus.OK, nearByCafeLocations);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> getNearByCafes(@RequestBody ClientPosInfoDto clientPosInfo) {
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfo);
        System.out.println("nearByCafeLocations = " + nearByCafeLocations);

        ResponseDTO responseDTO
                = new ResponseDTO("주변 카페 목록 출력", "", HttpStatus.OK, nearByCafeLocations);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
