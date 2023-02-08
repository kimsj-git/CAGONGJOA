package com.ssafy.backend.todaycafe.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import lombok.*;

import javax.persistence.*;

@Table(name = "fortune")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Fortune {

    //== Column  ==//

        /** 1. ID  **/

        @Id
        @GeneratedValue
        private Long id;

        @Column
        private String content;


}