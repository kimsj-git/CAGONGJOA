package com.ssafy.backend.mypage.domain.dto;

import com.ssafy.backend.cafe.domain.dto.CafeNameAndBrandDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeLiveRespDto {

    private int visitedAt; // 입실 일자 (yyyy-MM-dd)
    private int accTime; // 누적 시간
    private Double todoAchievementRate; // 달성도
    private CafeNameAndBrandDto cafeInfo; // name, brand
    private String fortuneMsg;

}
