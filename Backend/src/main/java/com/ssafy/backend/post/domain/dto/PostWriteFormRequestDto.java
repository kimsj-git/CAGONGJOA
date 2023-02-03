package com.ssafy.backend.post.domain.dto;


import com.ssafy.backend.post.domain.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWriteFormRequestDto {

    private String content;
    private PostType type;

    private Boolean cafeAuthorized;


}