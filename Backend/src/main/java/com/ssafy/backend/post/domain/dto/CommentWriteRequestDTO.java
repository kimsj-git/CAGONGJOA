package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentWriteRequestDTO {
    private Long postId;
    private String content;
    private Long group; // 어느 그룹인지 (부모의 pk)
}
