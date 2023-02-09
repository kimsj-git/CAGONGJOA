package com.ssafy.backend.cafe.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeNameAndBrandDto {
    private String name;
    private String brandType;
}
