package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentUpdateRequestDTO {

    private Long commentId;
    private Long memberId; // 테스팅시에만 사용, 추후 삭제
    private String content;

}
