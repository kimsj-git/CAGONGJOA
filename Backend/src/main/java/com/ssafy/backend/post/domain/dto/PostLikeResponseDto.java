package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostLikeResponseDto {

    private boolean isChecked;

    private Long postId;
    private int likeCount;


}
