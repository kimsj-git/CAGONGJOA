package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.PostImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailResponseDto {

    private Long postId;
    private LocalDateTime createdAt;
    private String postContent;

    private Slice<Comment> commentSlice;
    private List<String> imgPathList;
    private String commentContent;


    private int likeCounts;
    private int commentCounts;



    // 댓글리스트

    // private List<Image> images;

}
