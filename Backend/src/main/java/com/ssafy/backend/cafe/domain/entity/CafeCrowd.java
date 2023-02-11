package com.ssafy.backend.cafe.domain.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

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

}
