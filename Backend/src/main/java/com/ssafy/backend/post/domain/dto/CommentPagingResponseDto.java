package com.ssafy.backend.post.domain.dto;

import lombok.*;

import java.time.LocalDateTime;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "CommentResponseBuilder", builderClassName = "CommentResponseBuilder")
public class CommentPagingResponseDto {
    private Long memberId;
    // private Long verifiedCafeId;
    // private String verifiedCafeName;
    // private Tier tier;
    // private Badge badge;
    private String content;
    private LocalDateTime createdAt;
    private int commentLike;


}
