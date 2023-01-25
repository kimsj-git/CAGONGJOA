package com.ssafy.backend.oauth.dto;

import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OauthLoginDto {
    private String nickname;
    private Long oauthId;
    private String oauthType;
}
