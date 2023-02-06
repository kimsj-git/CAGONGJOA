package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CheckedResponseDto {
    private Long memberId;
    private String nickname;
    private String verifiedCafeName;
    private Long verifiedCafeId;
}
