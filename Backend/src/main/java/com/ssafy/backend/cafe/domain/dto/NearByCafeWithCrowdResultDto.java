package com.ssafy.backend.cafe.domain.dto;

import com.ssafy.backend.cafe.domain.enums.CrowdLevel;
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearByCafeWithCrowdResultDto {
    private BigInteger id;
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String brand_type;
    private CrowdLevel crowdLevel;
}
