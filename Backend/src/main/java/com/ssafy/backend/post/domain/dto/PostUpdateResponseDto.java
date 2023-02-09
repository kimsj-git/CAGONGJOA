package com.ssafy.backend.post.domain.dto;


import com.ssafy.backend.post.domain.enums.PostType;
import lombok.*;

import java.util.List;
import java.util.Map;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostUpdateResponseDto {

    private Long postId;
    private String Content;
    private List<Map.Entry<String,String>> imgPathList;
    private PostType type;

}