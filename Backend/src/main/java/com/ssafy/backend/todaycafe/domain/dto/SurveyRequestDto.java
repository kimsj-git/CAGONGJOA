package com.ssafy.backend.todaycafe.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class SurveyRequestDto {
    private String replyWifi;
    private String replyPower;
    private String replyToilet;
    private boolean replyTime;


}
