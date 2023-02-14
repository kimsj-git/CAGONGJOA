package com.ssafy.backend.post.domain.entity;

import com.ssafy.backend.common.entity.BaseEntity;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.post.domain.enums.PostType;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Table(name = "post")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(builderClassName = "postWriteBuilder", builderMethodName = "postWriteBuilder")
public class Post extends BaseEntity {

    //== Column  ==//

    /**
     * 1. 게시글의 ID
     **/
    @Id
    @GeneratedValue
    @Column
    private Long id;

    /**
     * 2. 멤버 id를 멤버 테이블과 조인을 이용하여 사용 - 멤버가 삭제되면 모든 글이 삭제
     **/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    // 임시컬럼 - member 인증되면 없앨거임
//        @Column(name = "member_id")
//        private Long memberId;

    /**
     * 3. 피드 내용
     **/
    private String content;

    /**
     * 4. 피드 타입 : 7가지 중 하나 (중복X)
     **/
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private PostType postType;

    /**
     * 5. 카페 인증된 유저인지 미인증된 유저인지 저장
     **/
    @Column(name = "is_cafe_authorized", columnDefinition = "TINYINT(1)", length = 1)
    private boolean isCafeAuthorized;

    /**
     * 6. 양방향 매핑
     **/
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<Comment> commentList;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<PostImage> postImageList;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<PostLike> postLikeList;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<PostCafe> postCafeList;

    /**
     * 생성자 : content, member, 카테고리, 이미지(나중추가)
     **/

    public void updateContent(String content) {
        this.content = content;
    }

    public void updatePostImage(List<PostImage> postImageList) {
        this.postImageList = postImageList;
    }

    public void updateAuthorized(){
        this.isCafeAuthorized = true;
    }


    public void updatePostCafe(List<PostCafe> postCafeList) {
        this.postCafeList = postCafeList;
    }

    public void deleteImages() {
        this.postImageList = new ArrayList<>();
    }

}