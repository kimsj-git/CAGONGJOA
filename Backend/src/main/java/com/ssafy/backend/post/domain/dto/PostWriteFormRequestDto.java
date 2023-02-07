package com.ssafy.backend.post.domain.dto;


import com.ssafy.backend.post.domain.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigInteger;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWriteFormRequestDto {

    private String content;
    private PostType type;
    private Boolean cafeAuthorized;
    private Double latitude;
    private Double longitude;
    private Double dist;


}