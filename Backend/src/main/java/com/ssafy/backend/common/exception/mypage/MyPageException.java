package com.ssafy.backend.common.exception.mypage;

import com.ssafy.backend.common.exception.BaseException;
import com.ssafy.backend.common.exception.BaseExceptionType;

public class MyPageException extends BaseException {
    private BaseExceptionType exceptionType;
    public MyPageException(BaseExceptionType exceptionType) {
        this.exceptionType = exceptionType;
    }

    @Override
    public BaseExceptionType getExceptionType() {
        return exceptionType;
    }
}