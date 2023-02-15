package com.ssafy.backend.post.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateFormRequestDto {

    /**   2. 글 등록 요청       **/
    private Long postId;
    private String content;
    private List<String> imageUrlList;

}