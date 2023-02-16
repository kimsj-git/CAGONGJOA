package com.ssafy.backend.member.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberCoinRespDto {
    private int CoffeeBeanCnt;
    private int CoffeeCnt;
}
