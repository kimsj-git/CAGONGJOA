package com.ssafy.backend.todaycafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckSurveyRespDto {
    private Boolean isVisited;
}
