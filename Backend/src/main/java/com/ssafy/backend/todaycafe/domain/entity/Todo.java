package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import lombok.*;

import javax.persistence.*;

@Table(name = "todo")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Todo {

    //== Column  ==//

    /**
     * 1. ID
     **/

    @Id
    @GeneratedValue
    private Long id;

    /**
     * 2. 운세 내용
     **/
    @Column
    private String content;

    /**
     * 3. 완료 여부
     */
    @Column(name = "is_complete")
    private boolean isComplete;

    /**
     * 4. 카페 방문일지 pk
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_visit_log_id")
    private CafeVisitLog cafeVisitLog;

    public void checkToggle() {
        if (this.isComplete) this.isComplete = false;
        else this.isComplete = true;
    }

    public void updateContent(String content) {
        this.content = content;
    }

}