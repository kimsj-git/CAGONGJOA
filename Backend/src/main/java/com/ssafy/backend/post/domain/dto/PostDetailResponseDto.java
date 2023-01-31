package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.member.domain.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailResponseDto {

    private Long id;
    private Member member;
    private LocalDateTime createdAt;
    private String postContent;
    private int likeCounts;
    private int commentCounts;


    // 댓글리스트

    // private List<Image> images;

}
