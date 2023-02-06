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
public class Todo extends BaseEntity {

    //== Column  ==//

        /** 1. ID  **/

        @Id
        @GeneratedValue
        private Long id;

        /** 2. 운세 내용   **/
        @Column
        private String content;


}