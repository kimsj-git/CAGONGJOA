package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Table(name = "fortune")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Fortune extends BaseEntity {

    //== Column  ==//

        /** 1. ID  **/

        @Id
        @GeneratedValue
        private Long id;

        @Column
        private String content;


}