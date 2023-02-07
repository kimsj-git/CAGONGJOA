package com.ssafy.backend.member.domain.entity;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.Assert;

import javax.persistence.*;

@Table(name = "member_cafe_tier")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberCafeTier {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "cafe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cafe cafe;

    private Long exp;

    @Builder(builderClassName = "TierBuilder", builderMethodName = "TierBuilder")
    MemberCafeTier(Member member, Cafe cafe, Long exp) {
        this.member = member;
        this.cafe = cafe;
        this.exp = exp;
    }
}