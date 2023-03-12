package com.ssafy.backend.cafe.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientPosInfoDto {
    @NotEmpty
    @Positive
    private Double latitude;
    @NotEmpty
    @Positive
    private Double longitude;
    @NotEmpty
    @Positive
    private Double dist;
}
