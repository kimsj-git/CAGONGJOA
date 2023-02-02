package com.ssafy.backend.member.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberIdAndNicknameDto {
    private long id;
    private String nickname;

}
