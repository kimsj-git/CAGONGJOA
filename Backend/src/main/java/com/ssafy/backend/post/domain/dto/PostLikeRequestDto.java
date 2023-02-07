package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class PostLikeRequestDto {
    private Long postId;
    private Boolean isChecked;


}
