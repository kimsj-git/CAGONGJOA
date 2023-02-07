package com.ssafy.backend.common.exception.jwt;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

public class JwtException extends BaseException {
    private BaseExceptionType exceptionType;
    public JwtException(BaseExceptionType exceptionType) {
        this.exceptionType = exceptionType;
    }

    @Override
    public BaseExceptionType getExceptionType() {
        return exceptionType;
    }
}
