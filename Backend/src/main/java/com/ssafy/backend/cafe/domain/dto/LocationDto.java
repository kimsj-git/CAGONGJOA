package com.ssafy.backend.cafe.domain.dto;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDto {
    @NotEmpty
    @Positive
    private Double latitude;
    @NotEmpty
    @Positive
    private Double longitude;
}
