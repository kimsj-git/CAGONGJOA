package com.ssafy.backend.post.domain.dto;

import lombok.*;

import java.time.LocalDateTime;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "RepliesResponseBuilder", builderClassName = "RepliesResponseBuilder")
public class RepliesPagingResponseDto {
    private Long commentId;
    private Long writerId;
    private String writerNickname;
    private Boolean writerType;
    private Long verifiedCafeId;
    private String verifiedCafeName;
    private String cafeBrandType;
    private Long exp;
    private String content;
    private LocalDateTime createdAt;
    private int commentLikeCnt;
    private Long parentId;
    private Boolean likeChecked;

    public void updateCommentVerifiedUser(Long verifiedCafeId, String verifiedCafeName, Long exp, String cafeBrandType) {
        this.verifiedCafeId = verifiedCafeId;
        this.verifiedCafeName = verifiedCafeName;
        this.exp = exp;
        this.cafeBrandType = cafeBrandType;
        this.writerType = true;

    }

    public void updateCommentLike (int commentLikeCnt) {
        this.commentLikeCnt = commentLikeCnt;
    }
    public void updateLikeChecked(Boolean likeChecked) {
        this.likeChecked = true;
    }

}
