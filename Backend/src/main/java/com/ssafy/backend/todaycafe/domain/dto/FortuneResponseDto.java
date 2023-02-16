package com.ssafy.backend.todaycafe.domain.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FortuneResponseDto {
    private String content;
    private int coffeeBeanCnt;
    private int coffeeCnt;
}
