package com.ssafy.backend.post.domain.entity;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Table(name = "post_likes")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostLike {

    //== Column  ==//

        /** 1. 게시글 좋아요 ID  **/
        @Id
        @GeneratedValue
        @Column(columnDefinition = "INT UNSIGNED")
        private Long id;

//        /** 2. post id를 post 테이블과 조인을 이용하여 사용 - 게시글이 삭제되면 모든 좋아요 삭제   **/
//        @ManyToOne(fetch = LAZY)
//        @JoinColumn(name = "post_id")
//        @OnDelete(action = OnDeleteAction.CASCADE)
//        private Post post;

        @Column(name = "post_id")
        private Long postId;

        /** 3. 멤버 - 매핑이 따로 필요없을듯 한데?  **/
        // 멤버가 삭제되면 Post 가 전부삭제 - 따라서 likes 도 전부삭제
        @Column(name = "member_id")
        private Long memberId;

        @Builder(builderClassName = "PostLikeBuilder", builderMethodName = "PostLikeBuilder")
        public PostLike (Long postId, Long memberId) {
                this.postId = postId;
                this.memberId = memberId;
        }

}