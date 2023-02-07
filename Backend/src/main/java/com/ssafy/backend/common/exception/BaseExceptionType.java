package com.ssafy.backend.common.exception;

import com.ssafy.backend.common.exception.enums.SignType;
import org.springframework.http.HttpStatus;

public interface BaseExceptionType {
    HttpStatus getHttpStatus();
    String getErrorMessage();
    SignType getDataSign();
}