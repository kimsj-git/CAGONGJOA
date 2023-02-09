package com.ssafy.backend.member.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.Assert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@ToString(of={"id", "nickname", "oauthId", "oauthType"}) // 엔티티는 하면 안됨!
@Table(name = "member")
public class Member extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    private String nickname;

    @Column(name = "oauth_id")
    private Long oauthId;

    @Column(name = "oauth_type")
    @Enumerated(EnumType.STRING)
    private OauthType oauthType;

    // 종섭 추가 - oneToOne 매핑 시, 주테이블에 FK 가 없으면 양방향 1대1 매핑으로 하라 했는데 (영한행님) 에러없으면 지움
    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private MemberCoin memberCoin;

    @Builder(builderClassName = "oAuthBuilder", builderMethodName = "oAuthBuilder")
    public Member(String nickname, Long oAuthId, OauthType oAuthType) {
        Assert.notNull(nickname, "nickname must not be null");
        Assert.notNull(oAuthId, "oAuthId must not be null");
        Assert.notNull(oAuthType, "oAuthType must not be null");

        this.nickname = nickname;
        this.oauthId = oAuthId;
        this.oauthType = oAuthType;
    }


    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateMemberCoin(MemberCoin memberCoin) {
        this.memberCoin = memberCoin;
    }


}