package com.ssafy.backend.post.domain.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSearchResponseDto {

    // 리턴객체 : 닉네임, 게시물 PK, 유저정보(현재카페, 티어) , 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수

    private int searchType;
    private boolean isCafeAuthorized;
    private Long postId;
    private String writerNickname;
    private Long exp;
    private String cafeName;
    private String brandType;
    private LocalDateTime createdAt;
    private List<String> imgUrlPath;
    private String content;
    private int postLikeCount;
    private int commentCount;

    public void updateDto(String cafeName, Long exp, String brandType) {
        this.cafeName = cafeName;
        this.exp = exp;
        this.brandType = brandType;
    }

    public void updateSearchType(int searchType){
        this.searchType = searchType;
    }
    // 댓글리스트

}
