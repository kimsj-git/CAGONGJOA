package com.ssafy.backend.common.exception.cafe;

import com.ssafy.backend.common.exception.BaseExceptionType;
import com.ssafy.backend.common.exception.enums.SignType;
import org.springframework.http.HttpStatus;

public enum CafeExceptionType implements BaseExceptionType {

    CAFE_AUTH_EXPIRED(HttpStatus.UNAUTHORIZED, "카페 위치 인증이 만료되었습니다.", SignType.CAFE),
    CAFE_AUTH_MISMATCH(HttpStatus.BAD_REQUEST, "비정상 위치입니다", SignType.CAFE),
    CAFE_AUTH_SAVE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "위치 인증 정보가 저장되지 않았습니다.", SignType.CAFE),
    ALREADY_SUBMIT_CROWD_SURVEY(HttpStatus.BAD_REQUEST, "이미 혼잡도 설문을 제출 하였습니다.", SignType.CAFE);


    private final HttpStatus httpStatus;
    private final String errorMessage;
    private final SignType sign;

    CafeExceptionType(HttpStatus httpStatus, String errorMessage, SignType sign) {
        this.httpStatus = httpStatus;
        this.errorMessage = errorMessage;
        this.sign = sign;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return this.httpStatus;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }

    @Override
    public SignType getDataSign() {
        return this.sign;
    }
}
