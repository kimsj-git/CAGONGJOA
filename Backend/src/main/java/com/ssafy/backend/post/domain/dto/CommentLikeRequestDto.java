package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CommentLikeRequestDto {
    private Long commentId;
    private boolean isChecked;

}
