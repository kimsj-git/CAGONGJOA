package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.enums.PostType;
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
    private Long postId;
    private String nickname;
    private Long exp;
    private boolean isCafeAuthorized;
    private String verifiedCafeName;
    private String verifiedCafeBrand;
    private LocalDateTime createdAt;
    private PostType type;
    private String postContent;
    private List<String> imgPathList;
    //comment
    private int likeCounts;
    private int commentCounts;
    private Boolean isLikeChecked;
    private List<CommentPagingResponseDto> commentSlice;

    public void updateDto(String verifiedCafeName, String verifiedCafeBrand, Long exp) {
        this.verifiedCafeBrand = verifiedCafeBrand;
        this.verifiedCafeName = verifiedCafeName;
        this.exp = exp;
    }

    public void updateComment(List<CommentPagingResponseDto> dtoList) {
        this.commentSlice = dtoList;
    }

    public void updateIsLiked(Boolean isLikeChecked) {
        this.isLikeChecked = isLikeChecked;
    }

}
