package com.ssafy.backend.cafe.domain.dto;

import lombok.Data;
import lombok.Getter;
import lombok.ToString;
import org.locationtech.jts.geom.Point;

@Data
public class NearByCafeResponseDto {
    private Long id;
    private String name;
    private String address;
    private String brand_type;

    private Double lat;
    private Double lng;
}
