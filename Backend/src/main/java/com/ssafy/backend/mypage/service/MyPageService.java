package com.ssafy.backend.mypage.service;

import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.GetTimeReqDto;

import java.util.List;

public interface MyPageService {

    List<CafeLiveRespDto> getCafeLives(int todayDate); // 211110
}
