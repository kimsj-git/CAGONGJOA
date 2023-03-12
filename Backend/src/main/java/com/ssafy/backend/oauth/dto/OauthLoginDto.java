package com.ssafy.backend.oauth.dto;

import com.ssafy.backend.member.domain.enums.OauthType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OauthLoginDto {
    @NotNull
    @Size(min = 2, max = 10) @Pattern(regexp = "^[a-zA-Z0-9]*$")
    private String nickname;
    @NotNull
    private Long oauthId;
    @NotNull
    private String oauthType;
}
