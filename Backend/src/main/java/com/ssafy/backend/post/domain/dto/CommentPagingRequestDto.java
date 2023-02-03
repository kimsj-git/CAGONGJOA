package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.post.domain.enums.PostType;
import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentPagingRequestDto {
    private Long postId;
    private Long commentId;



}
