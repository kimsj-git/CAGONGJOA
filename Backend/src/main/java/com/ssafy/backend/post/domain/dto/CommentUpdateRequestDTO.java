package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentUpdateRequestDTO {
    private Long commentId;
    private String content;

}
