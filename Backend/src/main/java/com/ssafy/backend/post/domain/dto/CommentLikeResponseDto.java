package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentLikeResponseDto {
    private boolean isChecked;
    private Long commentId;
    private int likeCount;

}
