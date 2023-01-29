package com.ssafy.backend.common.dto;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO {
    private String msg;
    private String errMsg;
    private HttpStatus httpStatus;
    private Object data;

}
