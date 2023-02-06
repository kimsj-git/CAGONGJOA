package com.ssafy.backend.todaycafe.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CoffeeMakeResponseDto {
    private Integer coffeeCnt;
    private Integer coffeeBeanCnt;
    private Integer responseType;
}
