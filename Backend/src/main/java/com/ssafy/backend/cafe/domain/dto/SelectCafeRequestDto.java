package com.ssafy.backend.cafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelectCafeRequestDto {
    @NotEmpty
    @Positive
    private long cafeId;
    @NotEmpty
    @Positive
    private Double latitude;
    @NotEmpty
    @Positive
    private Double longitude;
    @NotEmpty
    @Positive
    @Range(min=10000000, max=30000000)
    private int todayDate; // 20230213
}
