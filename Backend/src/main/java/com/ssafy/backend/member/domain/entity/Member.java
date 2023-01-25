package com.ssafy.backend.member.domain.entity;

import com.ssafy.backend.member.domain.entity.embeded.Period;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.springframework.util.Assert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id", "nickname", "oauthId", "oauthType", "period"}) // 엔티티는 하면 안됨!
public class Member {

    @Id @GeneratedValue
    private Long id;

    private String nickname;

    @Column(name = "oauth_id")
    private Long oauthId;

    @Column(name = "oauth_type")
    @Enumerated(EnumType.STRING)
    private OauthType oauthType;

//    @OneToOne(
//            mappedBy = "member",
//            fetch = FetchType.LAZY,
//            cascade = CascadeType.PERSIST,
//            orphanRemoval = true
//    )

    @Embedded
    private Period period;

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


}