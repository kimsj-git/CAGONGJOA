package com.ssafy.backend.common.exception.post;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

import java.io.IOException;

public class PostException extends BaseException {
    private BaseExceptionType exceptionType;
    public PostException(BaseExceptionType exceptionType) {
        this.exceptionType = exceptionType;
    }

    @Override
    public BaseExceptionType getExceptionType() {
        return exceptionType;
    }
}