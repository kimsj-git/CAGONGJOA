package com.ssafy.backend.common.exception.todaycafe;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

public class TodayCafeException extends BaseException {
    private BaseExceptionType exceptionType;
    public TodayCafeException(BaseExceptionType exceptionType) {
        this.exceptionType = exceptionType;
    }

    @Override
    public BaseExceptionType getExceptionType() {
        return exceptionType;
    }
}