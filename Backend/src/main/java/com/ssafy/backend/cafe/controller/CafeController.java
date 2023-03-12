package com.ssafy.backend.cafe.controller;

import com.ssafy.backend.cafe.domain.dto.*;
import com.ssafy.backend.cafe.service.CafeService;
import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.todaycafe.domain.dto.TodoResponseDto;
import com.ssafy.backend.todaycafe.service.TodayCafeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Range;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/cafe")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;
    private final TodayCafeService todayCafeService;
    private final MemberService memberService;


    @GetMapping("/auth")
    public ResponseEntity<ResponseDTO> checkCafeAuth() {
        // 15분 마다 클라이언트로부터 비동기로 레디스 체크 -> 인증된 상태라면 레디스 데이터 삭제 후 재생성 (time out 시간 초기화)
        cafeService.checkCafeAuth();
        ResponseDTO responseDTO = new ResponseDTO("위치 인증 체크 완료!", "", HttpStatus.OK, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    @Auth
    @CafeAuth
    @GetMapping("/auth/initCheck")
    public ResponseEntity<ResponseDTO> initCheckCafeAuth() {
        // 최초 접속시 위치인증 여부를 체크하고, 위치인증이 되었다면 카페 상호명과 위경도를 제공
        InitCafeAuthRespDto respDto = cafeService.initCheckCafeAuth();

        ResponseDTO responseDTO = new ResponseDTO("처음 접속시 위치 인증 체크 완료!", "", HttpStatus.OK, respDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /*
        사용자 위치의 카페 + 위경도 정보를 클라이언트로부터 제공받은 후, cafe id와 닉네임으로 redis에 위치 정보 등록
    */
    @PostMapping("/auth/select")
    public ResponseEntity<ResponseDTO> cafeAuth(@Validated @RequestBody SelectCafeRequestDto selectCafeRequestDto) {
        cafeService.saveCafeAuth(selectCafeRequestDto);
        int rewardCoin = cafeService.attendanceReward(selectCafeRequestDto.getTodayDate());
        if (rewardCoin != 0) {
            memberService.addMemberCoin(10); // 출석 체크시 10 커피콩 적립
        }

        RewardCoffeeBeanRespDto rewardCoffeeBeanRespDto = new RewardCoffeeBeanRespDto(rewardCoin);
        ResponseDTO responseDTO = new ResponseDTO("위치 인증 완료!", "", HttpStatus.CREATED, rewardCoffeeBeanRespDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    @GetMapping("/auth/data")
    public ResponseEntity<ResponseDTO> AuthResponse() {
        cafeService.saveTier();
        AfterCafeAuthResponseDto cafeAuthResponseDto = todayCafeService.saveCafeVisit();
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        List<TodoResponseDto> todoResponseDtoList = todayCafeService.findTodo(visitedAtValue);
        if(!todoResponseDtoList.isEmpty()) cafeAuthResponseDto.updateTodoList(todoResponseDtoList);
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
    public ResponseEntity<ResponseDTO> cafeAuth(@Validated @RequestBody LocationDto locationDto) {
        final double DIST = 0.2; // 50m 반경에 해당하는 근거리 카페만 가져온다
//        final double DIST = 0.5; // 50m 반경에 해당하는 근거리 카페만 가져온다
        ClientPosInfoDto clientPosInfoDto
                = new ClientPosInfoDto(locationDto.getLatitude(), locationDto.getLongitude(), DIST);
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfoDto);
        ResponseDTO responseDTO  = new ResponseDTO("카페 위치 인증 버튼 click", "",
                                                        HttpStatus.OK, nearByCafeLocations);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 현위치와 거리를 클라이언트에게 받아 해당 범위의 카페를 제공
     */
    @PostMapping
    public ResponseEntity<ResponseDTO> getNearByCafes(@Validated @RequestBody ClientPosInfoDto clientPosInfo) {
        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfo);

        ResponseDTO responseDTO
                = new ResponseDTO("주변 카페 목록 출력", "", HttpStatus.OK, nearByCafeLocations);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 카페 마커를 눌렀을 때 설문조사 내용을 기반으로 사용자에게 제공
     */
    @GetMapping("/survey")
    public ResponseEntity<ResponseDTO> cafeSurvey(@NotEmpty @Positive @RequestParam Double latitude,
                                                  @NotEmpty @Positive @RequestParam Double longitude,
                                                  @NotEmpty @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime todayTime) {
        LocationAndDateDto locationAndDateDto = new LocationAndDateDto(latitude, longitude, todayTime);
        CafeSurveyRespDto cafeSurveyRespDto = cafeService.getCafeSurvey(locationAndDateDto);

        ResponseDTO responseDTO = new ResponseDTO("카페 설문 데이터 전달 완료!", "",
                HttpStatus.OK, cafeSurveyRespDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 혼잡도 설문 실시 여부 체크
     */
    @GetMapping("/crowd/check")
    public ResponseEntity<ResponseDTO> checkCrowdSurvey(@NotEmpty @Positive @Range(min=10000000, max=30000000)
                                                            @RequestParam int todayDate) {
        boolean checkVal = cafeService.checkCrowdSurvey(todayDate);
        CrowdCheckRespDto crowdCheckRespDto = new CrowdCheckRespDto(checkVal);
        ResponseDTO responseDTO = new ResponseDTO("혼잡도 설문 여부 체크 완료!", "",
                                                        HttpStatus.OK, crowdCheckRespDto);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 현재 인증된 카페에서 날아오는 혼잡도 저장 하기 (1, 2, 3)
     * 인증 카페 정보는 레디스 조회
     * 클라이언트로부터 혼잡도 레벨과 오늘 날짜 정수형으로 yyyyMMdd 받기 (ex. 20230211)
     */
    @PostMapping("/crowd/save")
    public ResponseEntity<ResponseDTO> saveCafeCrowd(@Validated @RequestBody CrowdCheckReqDto crowdCheckReqDto) {

        cafeService.saveCrowdLevel(crowdCheckReqDto);
        memberService.addMemberCoin(1); // 혼잡도 설문 제출시 1 커피콩 적립
        ResponseDTO responseDTO
                = new ResponseDTO("혼잡도 저장 완료", "",
                HttpStatus.CREATED, null);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 현 위치 + 거리 + 현재 시간을 받아 클라이언트에게 해당 범위의 카페 + 혼잡도 정보 제공
     */
    @PostMapping("/crowd")
    public ResponseEntity<ResponseDTO> getNearByCafesWithCrowd(@Validated @RequestBody CafeCrowdRequestDto cafeCrowdRequestDto) {

        ClientPosInfoDto clientPosInfo = ClientPosInfoDto.builder()
                                                        .latitude(cafeCrowdRequestDto.getLatitude())
                                                        .longitude(cafeCrowdRequestDto.getLongitude())
                                                        .dist(cafeCrowdRequestDto.getDist()).build();

        CurTimeReqDto curTimeReqDto = new CurTimeReqDto(cafeCrowdRequestDto.getTodayTime());

        List<NearByCafeResultDto> nearByCafeLocations = cafeService.getNearByCafeLocations(clientPosInfo);
        List<NearByCafeWithCrowdResultDto> nearByCafeWithCrowdResultDtoList
                = cafeService.addCrowdInfoToNearByCafes(nearByCafeLocations, curTimeReqDto);

        ResponseDTO responseDTO
                = new ResponseDTO("주변 카페 목록을 혼잡도와 함께 출력", "",
                HttpStatus.OK, nearByCafeWithCrowdResultDtoList);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
