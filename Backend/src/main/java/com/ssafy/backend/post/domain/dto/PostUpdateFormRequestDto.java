package com.ssafy.backend.post.domain.dto;


import com.ssafy.backend.post.domain.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateFormRequestDto {

    /**   2. 글 등록 요청       **/
    private Long postId;
    private String content;
    private PostType type;
    private List<String> keyNameList;

}