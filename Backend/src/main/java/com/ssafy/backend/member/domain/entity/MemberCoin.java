package com.ssafy.backend.member.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.Assert;

import javax.persistence.*;

@Table(name = "member_coin")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberCoin {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "coffee_bean_cnt")
    private Integer coffeeBeanCount;
    @Column(name = "coffee_cnt")
    private Integer coffeeCount;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder(builderClassName = "coinBuilder", builderMethodName = "coinBuilder")
    MemberCoin(Integer coffeeBeanCount, Integer coffeeCount, Member member) {
        this.coffeeBeanCount = coffeeBeanCount;
        this.coffeeCount = coffeeCount;
        this.member = member;

    }
    public void updateCoin(Integer coffeeBeanCount, Integer coffeeCount){
        this.coffeeBeanCount = coffeeBeanCount;
        this.coffeeCount = coffeeCount;
    }



}