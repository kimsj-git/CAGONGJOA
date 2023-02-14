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
    private String cafeName;
    private String commentContent;
    private String postContent;
    private LocalDateTime createdAt;
    private int commentLikeCnt;

    public void updateCafeName(String cafeName)  {
        this.cafeName = cafeName;
    }

}
