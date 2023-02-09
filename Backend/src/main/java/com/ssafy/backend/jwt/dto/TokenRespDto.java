package com.ssafy.backend.jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TokenRespDto {
    private String AccessToken;
    private String RefreshToken;
}
