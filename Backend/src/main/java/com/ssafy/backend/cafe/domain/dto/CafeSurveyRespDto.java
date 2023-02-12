package com.ssafy.backend.cafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CafeSurveyRespDto {
    private int replyWifi_high;
    private int replyWifi_mid;
    private int replyWifi_low;

    private int replyPower_high;
    private int replyPower_mid;
    private int replyPower_low;

    private int replyToilet_high;
    private int replyToilet_mid;
    private int replyToilet_low;

    private boolean replyTime;
    private int useMemberCount;
}
