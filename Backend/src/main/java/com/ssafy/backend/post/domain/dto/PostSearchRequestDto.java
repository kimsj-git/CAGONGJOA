package com.ssafy.backend.post.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSearchRequestDto {
    private Long postId;
    private int searchType;
    private String searchKey;
    private Double latitude;
    private Double longitude;
    private Double dist;

}
