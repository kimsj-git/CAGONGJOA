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

    // 리턴객체 : 게시물 PK, 유저정보(현재카페, 티어, 닉네임, 뱃지) , 만든시간, 이미지, 글내용 전체, 좋아요 개수, 댓글 개수
    private Long postId;
    private List<Map.Entry<BigInteger, String>> cafeInfos;
    // private Tier tier;
    // private Logo logo;
    // private Badge badge
    private LocalDateTime createdAt;
    private List<String> imgUrlPath;
    private String content;
    private int postLikeCount;
    private int commentCount;

    // 댓글리스트

}
