package com.ssafy.backend.cafe.domain.entity;

import com.ssafy.backend.common.entity.CreateAtEntity;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.springframework.util.Assert;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id", "crowdValue"})
@Table(name = "cafe_crowd")
public class CafeCrowd extends CreateAtEntity {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    @Column(name = "crowd_value")
    private int crowdValue;

    @Builder(builderClassName = "cafeCrowdSaveBuilder", builderMethodName = "cafeCrowdSaveBuilder")
    public CafeCrowd(Cafe cafe, int crowdValue) {
        Assert.notNull(cafe, "cafe must not be null");
        this.cafe = cafe;
        this.crowdValue = crowdValue;
    }
}
