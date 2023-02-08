package com.ssafy.backend.mypage.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 프론트엔드에게 Date 데이터를 받을 수 있도록 하는 dto
 */

@Data
@AllArgsConstructor
public class GetTimeReqDto {
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate todayDate;

}
