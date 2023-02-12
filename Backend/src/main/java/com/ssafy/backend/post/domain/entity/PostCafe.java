package com.ssafy.backend.post.domain.entity;

import com.ssafy.backend.cafe.domain.entity.Cafe;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Table(name = "post_cafe")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostCafe {

    //== Column  ==//

        /** 1. 게시글 카페 ID  **/
        @Id
        @GeneratedValue
        @Column(columnDefinition = "INT UNSIGNED")
        private Long id;

        /** 2. post id를 post 테이블과 조인을 이용하여 사용 - 게시글이 삭제되면 모든 좋아요 삭제  **/
        @Setter
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "post_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Post post;


        /** 3. 카페위치   **/
        @ManyToOne
        @JoinColumn(name = "cafe_location_id")
        private Cafe cafe;

        public void updatePost(Post post){
                this.post = post;
        }

}