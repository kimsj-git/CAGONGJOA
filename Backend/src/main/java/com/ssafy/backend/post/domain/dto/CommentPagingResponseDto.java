package com.ssafy.backend.post.domain.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "CommentResponseBuilder", builderClassName = "CommentResponseBuilder")
public class CommentPagingResponseDto {
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
    private Long groupNo;
    private Boolean likeChecked;
    private List<RepliesPagingResponseDto> replies;

    public void updateCommentVerifiedUser(Long verifiedCafeId, String verifiedCafeName, Long exp, String cafeBrandType) {
        this.verifiedCafeId = verifiedCafeId;
        this.verifiedCafeName = verifiedCafeName;
        this.exp = exp;
        this.cafeBrandType = cafeBrandType;
        this.writerType = true;

    }

    public void updateReplies(List<RepliesPagingResponseDto> replies) {
        this.replies = replies;
    }
}
