package com.ssafy.backend.common.exception.cafe;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

public class CafeException extends BaseException {
    private BaseExceptionType exceptionType;
    public CafeException(BaseExceptionType exceptionType) {
        this.exceptionType = exceptionType;
    }

    @Override
    public BaseExceptionType getExceptionType() {
        return exceptionType;
    }
}