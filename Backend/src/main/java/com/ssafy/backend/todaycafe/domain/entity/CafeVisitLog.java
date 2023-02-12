package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.List;

@Table(name = "cafe_visit_log")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CafeVisitLog {

    //== Column  ==//

    /**
     * 1. ID
     **/

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "visited_at")
    private Integer visitedAt;

    @Column(name = "acc_time")
    @ColumnDefault("0")
    private Integer accTime;

    /**
     * 4. 멤버 id를 멤버 테이블과 조인을 이용하여 사용 - 멤버가 삭제되면 모든 글이 삭제
     **/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    /**
     * 5. cafe_Id 를 cafe와 동기화하여 사용
     **/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    /**
     * 6. 운세
     **/
    @Column(name = "fortune_id")
    @ColumnDefault("0")
    private Long fortuneId;

    /**
     * 7. 만족도 설문 제출여부 - 0,1
     **/
    @Column(name = "is_survey", columnDefinition = "TINYINT(1)", length = 1)
    private boolean isSurvey;


    /**
     * 8. 혼잡도 설문 제출여부 - 0,1
     **/
    @Column(name = "is_crowd_survey", columnDefinition = "TINYINT(1)", length = 1)
    private boolean isCrowdSurvey;


    /**
     * 9. Todo 와 양방향 매핑
     **/
    @OneToMany(mappedBy = "cafeVisitLog")
    private List<Todo> todoList;


    /**
     * 연관 메서드
     **/
    public void updateFortune(Long fortuneId) {
        this.fortuneId = fortuneId;
    }

    public void updateTimeBar() {
        if (this.accTime < 120) {
            this.accTime += 1;
        } else {
            this.accTime = 120;
        }
    }

    public void updateIsSurvey() {
        this.isSurvey = true;
    }

    public void setSurvey(boolean survey) {
        isSurvey = survey;
    }
}