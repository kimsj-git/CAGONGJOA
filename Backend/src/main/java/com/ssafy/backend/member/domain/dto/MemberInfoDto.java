package com.ssafy.backend.member.domain.dto;

import com.ssafy.backend.member.domain.enums.NicknameType;
import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@AllArgsConstructor
@Builder
public class MemberInfoDto {
    private String nicknameType;
    private long kakaoMemberId;
    private String oauthType;
}
