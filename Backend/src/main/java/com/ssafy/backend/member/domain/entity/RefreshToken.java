package com.ssafy.backend.member.domain.entity;

import com.ssafy.backend.member.domain.entity.embeded.Period;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id @GeneratedValue
    private Long id;

    private String value;

    @Embedded
    private Period period;

//    // 일단은 여기에 저장하지만 추후 Redis 서버를 통해 구현하기
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_id")
//    private Member member;

}
