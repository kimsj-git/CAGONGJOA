package com.ssafy.backend.post.domain.entity;

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
// @ToString(of={"id", "memberId", "type", "content"})
public class Comment extends BaseEntity {
    //== Column ==//

        //1. 댓글의 ID
        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) // MYSQL Auto Increment
        @Column(columnDefinition = "INT UNSIGNED")
        private Long id;

        //2. postid 를 조인으로 하여 사용
        @ManyToOne(fetch = LAZY)
        @JoinColumn(name = "post_id")
        private Post post;

        // 3. memberId를 조인으로 하여 사용
//        @ManyToOne(fetch = LAZY)
//        @JoinColumn(name = "member_id")
//        private Member member;

        @Column(name = "member_id")
        private Long memberId;

        // 4. 댓글의 내용
        @Column(nullable = false)
        private String content;


        // 6. 부모 댓글의 pk - 요거 nullable 되야하는거 아닌가? 아니면 자기자신이 부모?
        private Long group;

        // 7. 댓글 순서 - Auto Increment?
        @GeneratedValue(strategy=GenerationType.IDENTITY)
        private Long step;

        @Builder(builderClassName = "CommentWriteBuilder", builderMethodName = "CommentWriteBuilder")
        public Comment ()



}
