package com.ssafy.backend.cafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AfterCafeAuthResponseDto {
    private String cafeName;
    private Long exp;
    private String brandType;
    private int accTime;
    private int coffeeBeanCnt;
    private int coffeeCnt;
    private String fortune;
//    private List<> todoList;
    public void updateFortune(String fortune) {
        this.fortune = fortune;
    }
}
