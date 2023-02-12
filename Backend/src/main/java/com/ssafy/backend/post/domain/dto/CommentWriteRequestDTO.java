package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentWriteRequestDTO {
    private Long postId;
    private long commentId;
    private String content;
}
