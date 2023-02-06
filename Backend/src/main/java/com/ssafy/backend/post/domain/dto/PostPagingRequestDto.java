package com.ssafy.backend.post.domain.dto;

import com.ssafy.backend.post.domain.enums.PostType;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostPagingRequestDto {
    private Long postId;
    private List<PostType> types;
    private Double latitude;
    private Double longitude;
    private Double dist;



}
