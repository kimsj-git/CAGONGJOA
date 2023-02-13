package com.ssafy.backend.mypage.domain.dto;

import lombok.*;

import java.time.LocalDateTime;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyCommentResponseDto {
    private Long commentId;
    private Boolean writerType;
    private Long verifiedCafeId;
    private String verifiedCafeName;
    private String cafeBrandType;
    private Long exp;
    private String content;
    private LocalDateTime createdAt;
    private int commentLikeCnt;


    public void updateCommentVerifiedUser(Long verifiedCafeId, String verifiedCafeName, Long exp, String cafeBrandType) {
        this.verifiedCafeId = verifiedCafeId;
        this.verifiedCafeName = verifiedCafeName;
        this.exp = exp;
        this.cafeBrandType = cafeBrandType;

    }
}
