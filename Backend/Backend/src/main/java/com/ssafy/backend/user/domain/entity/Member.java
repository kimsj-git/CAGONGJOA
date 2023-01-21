package com.ssafy.backend.user.domain.entity;

import com.ssafy.backend.user.domain.entity.embeded.Period;
import lombok.*;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id", "username"}) // 엔티티는 하면 안됨!
public class Member {

    @Id @GeneratedValue
    private Long id;

    private String username;

    @Embedded
    private Period period;
}
