package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name = "survey")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@ToString(of={"id", "replyWifi", "replyPower", "replyToilet", "replyTime", "createdAt"})
public class Survey{

    //== Column  ==//

        /** 1. ID  **/

        @Id
        @GeneratedValue
        private Long id;

        /** 2. Member 와 다대일 매핑   **/
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn (name = "member_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Member member;

        /**
         * 3. Cafe와 다대일 매핑
         */
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn (name = "cafe_id")
        private Cafe cafe;

        /**
         * 4. 입력받는 것
         */
        @Column(name="reply_wifi")
        private String replyWifi;
        @Column(name="reply_power")
        private String replyPower;
        @Column(name="reply_toilet")
        private String replyToilet;
        @Column(name="reply_time")
        private boolean replyTime;

        /**
         * 5. 입력받는 것
         */

        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;
        

}