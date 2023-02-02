package com.ssafy.backend.cafe.domain.entity;

import com.ssafy.backend.common.entity.embeded.Period;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id"})
public class Cafe {
    @Id
    @GeneratedValue
    private Long id;

    private String cafeCode;
    private String name;
    private String brandType;

}
