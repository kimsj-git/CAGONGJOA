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
    private int visitedAt; // 20231110
    private Boolean isComplete; // create시 false, 토글 버튼 누르면 이전꺼랑 다른 bool값이 채워짐


}
