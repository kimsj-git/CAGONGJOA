package com.ssafy.backend.post.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.post.domain.enums.PostType;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;


import static javax.persistence.FetchType.LAZY;

@Table(name = "post")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@ToString(of={"id", "memberId", "type", "content"})
public class Post extends BaseEntity {

    //== Column  ==//

        /** 1. 게시글의 ID  **/
        @Id
        @GeneratedValue
        @Column(columnDefinition = "INT UNSIGNED")
        private Long id;

        /** 2. 멤버 id를 멤버 테이블과 조인을 이용하여 사용 - 멤버가 삭제되면 모든 글이 삭제   **/
        @ManyToOne
        @JoinColumn(name = "member_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Member member;

        // 임시컬럼 - member 인증되면 없앨거임
//        @Column(name = "member_id")
//        private Long memberId;

        /**  3. 피드 내용   **/
        private String content;

        /**  4. 피드 타입 : 7가지 중 하나 (중복X)   **/
        @Enumerated(EnumType.STRING)
        @Column(name = "type")
        private PostType postType;

        /**  5. 이미지 참조 - 추후 추가    **/

//        @OneToMany(mappedBy = "post", cascade = CascadeType.PERSIST, orphanRemoval = true)
//        private List<Image> images;


        /**  생성자 : content, member, 카테고리, 이미지(나중추가)   **/
        @Builder(builderClassName = "postWriteBuilder", builderMethodName = "postWriteBuilder")
        public Post(String content, Member member, PostType postType) {
                this.member = member;
                this.content = content;
                this.postType = postType;
        }

        /**  연관 메서드    **/
        /**  1. getId    **/ // 추후 이미지도 추가해야함

        public void saveMember(Member member) {
                this.member = member;
                member.getId();
        }

        public void updateContents(String content) {
                this.content = content;
        }
        

}