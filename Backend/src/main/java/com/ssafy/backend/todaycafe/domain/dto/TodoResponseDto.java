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
    private int responseType;

    public void updateDto(String content, Boolean isComplete) {
        this.content = content;
        this.isComplete = isComplete;
    }

    public void updateResponseType(int responseType) {
        this.responseType = responseType;
    }
}
