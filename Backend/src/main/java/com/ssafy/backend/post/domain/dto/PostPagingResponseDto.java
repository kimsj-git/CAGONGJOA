package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.post.domain.entity.*;
import lombok.*;
import org.springframework.data.domain.Pageable;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostPagingResponseDto {

    // 리턴객체 : 닉네임, 게시물 PK, 유저정보(현재카페, 티어) , 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수
    private String postType;
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

    public void updateDto(String cafeName, Long exp, String brandType, String postType) {
        this.cafeName = cafeName;
        this.exp = exp;
        this.brandType = brandType;
        this.postType = postType;
    }
    // 댓글리스트

}
