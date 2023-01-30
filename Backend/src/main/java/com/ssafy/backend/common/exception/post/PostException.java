package com.ssafy.backend.common.exception.post;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

public class PostException extends BaseException {

    private BaseExceptionType baseExceptionType;


    public PostException(BaseExceptionType baseExceptionType) {
        this.baseExceptionType = baseExceptionType;
    }
    @Override
    public BaseExceptionType getExceptionType() {
        return baseExceptionType;
    }
}
