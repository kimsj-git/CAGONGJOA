package com.ssafy.backend.cafe.domain.entity;

import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.*;
import org.springframework.util.Assert;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of={"id", "crowdValue", "createdAt"})
@Table(name = "cafe_crowd")
public class CafeCrowd {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    @Column(name = "crowd_value")
    private int crowdValue;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder(builderClassName = "cafeCrowdBuilder", builderMethodName = "cafeCrowdBuilder")
    public CafeCrowd(Cafe cafe, int crowdValue) {
        Assert.notNull(cafe, "cafe must not be null");

        this.cafe = cafe;
        this.crowdValue = crowdValue;
    }

}
