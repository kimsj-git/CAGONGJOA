package com.ssafy.backend.common.dto;

import com.ssafy.backend.common.exception.enums.SignType;
import lombok.*;

@Data
@Builder(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@NoArgsConstructor
public class ErrSignRespDto {
    // ResponseDto의 Data 필드에 넣을것, 에러코드 중복 회피를 위해 정의함
    private SignType sign;
}
