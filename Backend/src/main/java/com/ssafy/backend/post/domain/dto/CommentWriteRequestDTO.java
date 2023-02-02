package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentWriteRequestDTO {

    private String nickname; // nickname 을 받아서 사용
    private Long postId;
    private Long group; // 어느 그룹인지 (부모의 pk)
    private Long memberId; // 테스팅시에만 사용, 추후 삭제
    private String content;

}
