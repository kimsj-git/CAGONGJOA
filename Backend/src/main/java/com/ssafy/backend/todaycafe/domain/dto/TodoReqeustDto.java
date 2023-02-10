package com.ssafy.backend.todaycafe.domain.dto;

import lombok.*;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class TodoReqeustDto {
    private int eventType;
    private Long todoId;
    private String content;
    private int visitedAt;
    private boolean isComplete;


}
