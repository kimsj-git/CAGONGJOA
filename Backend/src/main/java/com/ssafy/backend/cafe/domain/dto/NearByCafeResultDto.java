package com.ssafy.backend.cafe.domain.dto;

import lombok.*;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.math.BigInteger;

// SELECT cf.id, cl.address, cl.point, cf.name, cf.brand_type
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearByCafeResultDto {
    private BigInteger id;
    private String name;
    private String address;
    private BigDecimal lat;
    private BigDecimal lng;
    private String brand_type;
}
