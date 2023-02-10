package com.ssafy.backend.todaycafe.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class TodoResponseDto {
    private Long id;
    private String content;
    private boolean isComplete;
}
