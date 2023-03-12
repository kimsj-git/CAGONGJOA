package com.ssafy.backend.cafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Positive;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CrowdCheckReqDto {
    @NotEmpty
    @Range(min=0, max=3)
    private int crowdLevel;
    @NotEmpty
    @Positive
    @Range(min=10000000, max=30000000)
    private int todayDate;
}
