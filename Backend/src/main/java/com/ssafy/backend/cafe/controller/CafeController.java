package com.ssafy.backend.cafe.controller;

import com.ssafy.backend.cafe.domain.dto.*;
import com.ssafy.backend.cafe.service.CafeService;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
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
    private final TodayCafeService todayCafeService;

    @GetMapping("/auth")
    public ResponseEntity<ResponseDTO> checkCafeAuth() {
        // 15분 마다 클라이언트로부터 비동기로 레디스 체크 -> 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        cafeService.checkCafeAuth();
        ResponseDTO responseDTO = new ResponseDTO("위치 인증 체크 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /*
        사용자 위치의 카페 + 위경도 정보를 클라이언트로부터 제공받은 후, cafe id와 닉네임으로 redis에 위치 정보 등록
    */
    @PostMapping("/auth/select")
    public ResponseEntity<ResponseDTO> cafeAuth(@RequestBody SelectCafeRequestDto selectCafeRequestDto) {
        cafeService.saveCafeAuth(selectCafeRequestDto);
        ResponseDTO responseDTO = new ResponseDTO("위치 인증 완료!", "", HttpStatus.CREATED, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @GetMapping("/auth/getResponse")
    public ResponseEntity<ResponseDTO> AuthResponse() throws Exception {
        cafeService.saveTier();
        AfterCafeAuthResponseDto cafeAuthResponseDto = todayCafeService.saveCafeVisit();
        // 위치인증 완료되었을 때, 기존 공부했던 시간 return 해줘야함
        ResponseDTO responseDTO = new ResponseDTO("위치 인증 reponse 전달완료!", "", HttpStatus.OK, cafeAuthResponseDto);

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 위치인증 버튼을 눌렀을 때 반경 50m에 해당하는 근거리 카페만 제공
     * @param locationDto
     * @return
     */
    @PostMapping("/auth")
    public ResponseEntity<ResponseDTO> cafeAuth(@RequestBody LocationDto locationDto) {
        System.out.println("locationDto = " + locationDto);
        final double DIST = 0.05; // 50m 반경에 해당하는 근거리 카페만 가져온다
        ClientPosInfoDto clientPosInfoDto
                = new ClientPosInfoDto(locationDto.getLatitude(), locationDto.getLongitude(), DIST);
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfoDto);
        ResponseDTO responseDTO  = new ResponseDTO("카페 위치 인증 버튼 click", "",
                                                        HttpStatus.OK, nearByCafeLocations);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * 현위치와 거리를 클라이언트에게 받아 해당 범위의 카페를 제공
     * @param clientPosInfo
     */
    @PostMapping
    public ResponseEntity<ResponseDTO> getNearByCafes(@RequestBody ClientPosInfoDto clientPosInfo) {
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfo);
        ResponseDTO responseDTO
                = new ResponseDTO("주변 카페 목록 출력", "", HttpStatus.OK, nearByCafeLocations);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
