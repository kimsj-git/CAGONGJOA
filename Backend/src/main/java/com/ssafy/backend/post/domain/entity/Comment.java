package com.ssafy.backend.post.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Table(name = "comment")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
//@ToString(of={"id", "content","group","step"})
public class Comment extends BaseEntity {
    //== Column ==//

        //1. 댓글의 ID
        @Id
        @GeneratedValue // MYSQL Auto Increment
        @Column
        private Long id;

        //2. postid 를 조인으로 하여 사용
        @ManyToOne(fetch = LAZY)
        @JoinColumn(name = "post_id")
        private Post post;

//         3. memberId를 조인으로 하여 사용
        @ManyToOne
        @JoinColumn(name = "member_id")
        private Member member;

//        @Column(name = "member_id")
//        private Long memberId;

        // 4. 댓글의 내용
        @Column
        private String content;
        // 5. 댓글 그룹의 pk
        @Column
        private Long group;
        @Column
        private Long step;

        @Builder(builderClassName = "CommentWriteBuilder", builderMethodName = "CommentWriteBuilder")
        public Comment (Post post, Member member, String content, Long group, Long step) {
                this.post = post;
                this.member = member;
                this.content = content;
                this.group = group;
                this.step = step;
        }



}
