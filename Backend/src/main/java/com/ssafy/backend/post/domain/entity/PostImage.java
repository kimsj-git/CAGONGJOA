package com.ssafy.backend.post.domain.entity;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Table(name = "post_img")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostImage {

    //== Column  ==//

        /** 1. 이미지의 ID  **/

        @Id
        @GeneratedValue
        @Column(columnDefinition = "INT UNSIGNED")
        private Long id;

        /** 2. post id를 post 테이블과 조인을 이용하여 사용 - 게시글이 삭제되면 모든 이미지 삭제   **/
        @ManyToOne
        @JoinColumn(name = "post_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Post post;

        /**  3. 이미지 url   **/
        @Column(name = "img_url")
        private String imgUrl;



}