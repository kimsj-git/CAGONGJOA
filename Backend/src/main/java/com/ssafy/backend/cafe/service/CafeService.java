package com.ssafy.backend.cafe.service;

import com.ssafy.backend.cafe.domain.dto.*;

import java.util.List;

public interface CafeService {
    List<NearByCafeResultDto> getNearByCafeLocations(ClientPosInfoDto clientPosInfoDto);

    void saveCafeAuth(SelectCafeRequestDto selectCafeRequestDto);

    void checkCafeAuth();

    void saveTier();

    List<NearByCafeWithCrowdResultDto> addCrowdInfoToNearByCafes(List<NearByCafeResultDto> nearByCafeLocations,
                                                                 CurTimeReqDto curTimeReqDto);

    void saveCrowdLevel(CrowdCheckReqDto crowdCheckReqDto);

    boolean checkCrowdSurvey(int todayDate);

    CafeSurveyRespDto getCafeSurvey(LocationAndDateDto locationDto);

    int attendanceReward(int todayDate);

    InitCafeAuthRespDto initCheckCafeAuth();
}
