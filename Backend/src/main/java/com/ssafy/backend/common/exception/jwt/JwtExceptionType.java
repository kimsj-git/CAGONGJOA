package com.ssafy.backend.common.exception.jwt;

import com.ssafy.backend.common.exception.BaseExceptionType;
import org.springframework.http.HttpStatus;

public enum JwtExceptionType implements BaseExceptionType {

    NOT_FOUND_MEMBER(HttpStatus.BAD_REQUEST, "회원 정보가 없습니다.");


    private final HttpStatus httpStatus;
    private final String errorMessage;

    JwtExceptionType(HttpStatus httpStatus, String errorMessage) {
        this.httpStatus = httpStatus;
        this.errorMessage = errorMessage;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return null;
    }

    @Override
    public String getErrorMessage() {
        return null;
    }
}
