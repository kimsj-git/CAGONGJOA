package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.post.domain.entity.Comment;
import lombok.*;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponseDto {
    // member
    private String nickname;

//    private Badge badge;
//    private Tier tier;
//    private cafeList cafelist;

    private boolean isCafeAuthorized;
    private String verifiedCafeName;

    // post
    private Long postId;
    private LocalDateTime createdAt;
    private String postContent;
    private List<String> imgPathList;
    //comment
    private Slice<Comment> commentSlice;
    private int likeCounts;
    private int commentCounts;




}
