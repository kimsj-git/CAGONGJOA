package com.ssafy.backend.oauth.dto;

import com.ssafy.backend.jwt.dto.TokenRespDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRespDto {
    private String nickname;
    private TokenRespDto jwtTokens;
}
