package com.ssafy.backend.mypage.service;

import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.GetTimeReqDto;
import com.ssafy.backend.mypage.domain.dto.MyFeedResponseDto;
import com.ssafy.backend.mypage.domain.dto.VisitCafeListResponseDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MyPageService {

    List<CafeLiveRespDto> getCafeLives(int todayDate); // 211110

    List<VisitCafeListResponseDto> getCafeVisitList();

    List<MyFeedResponseDto> getMyFeed(Long postId, Pageable pageable);
}
