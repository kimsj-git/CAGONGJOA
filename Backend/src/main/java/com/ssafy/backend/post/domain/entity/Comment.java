package com.ssafy.backend.post.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

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
        @ManyToOne
        @JoinColumn(name = "post_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Post post;

//         3. memberId를 조인으로 하여 사용
        @ManyToOne
        @JoinColumn(name = "member_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Member member;

        // 4. 댓글의 내용
        @Column
        private String content;
        // 5. 댓글 그룹의 pk
        @Column
        private Long group;
        @Column
        private Long step;

        @OneToMany(mappedBy = "comment")

        private List<CommentLike> commentLikeList = new ArrayList<>();

        @Builder(builderClassName = "CommentWriteBuilder", builderMethodName = "CommentWriteBuilder")
        public Comment (Post post, Member member, String content, Long group, Long step) {
                this.post = post;
                this.member = member;
                this.content = content;
                this.group = group;
                this.step = step;
        }



}
