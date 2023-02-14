package com.ssafy.backend.mypage.service;

import com.ssafy.backend.mypage.domain.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MyPageService {

    List<CafeLiveRespDto> getCafeLives(int todayDate); // 211110

    List<VisitCafeListResponseDto> getCafeVisitList();

    List<MyFeedResponseDto> getMyFeed(Long postId, Pageable pageable);

    List<MyCommentResponseDto> getMyComment(Long commentId, Pageable pageable);
}
