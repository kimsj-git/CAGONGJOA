package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Table(name = "cafe_visit_log")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CafeVisitLog extends BaseEntity {

    //== Column  ==//

        /** 1. ID  **/

        @Id
        @GeneratedValue
        private Long id;

        /** 4. 멤버 id를 멤버 테이블과 조인을 이용하여 사용 - 멤버가 삭제되면 모든 글이 삭제   **/
        @ManyToOne
        @JoinColumn(name = "member_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Member member;

        /** 5. cafe_Id 를 cafe와 동기화하여 사용   **/
        @Column(name = "cafe_id")
        private Long cafeId;

        /**  6. 운세   **/
        @Column(name = "fortune_id")
        private Long fortuneId;

        /**  7. 혼잡도 제출여부 - 0,1   **/

        @Column
        private boolean isSurvey;

        /**  생성자 : content, member, 카테고리, 이미지(나중추가)   **/


        /**  연관 메서드    **/
        void updateFortune(Long fortuneId) {
                this.fortuneId = fortuneId;
        }



}