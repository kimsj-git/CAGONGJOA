package com.ssafy.backend.cafe.domain.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id"})
@Table(name = "cafe")
public class Cafe {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "cafe_code")
    private String cafeCode;
    private String name;
    @Column(name = "brand_type")
    private String brandType;

}
