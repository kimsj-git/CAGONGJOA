package com.ssafy.backend.post.domain.dto;

import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostPagingRequestDto {

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 10;

    private String type;

    private String keyword;

    public String[] getTypes() {
        if(type == null || type.isEmpty()){
            return null;
        }
        return type.split("");
    }

    public Pageable getPageable(String...props) {
        return PageRequest.of(this.page -1, this.size, Sort.by(props).descending());
    }

}
