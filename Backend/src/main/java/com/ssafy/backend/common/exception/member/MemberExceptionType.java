package com.ssafy.backend.common.exception.member;

import com.ssafy.backend.common.exception.BaseExceptionType;
import com.ssafy.backend.common.exception.enums.SignType;
import org.springframework.http.HttpStatus;

public enum MemberExceptionType implements BaseExceptionType {
    //== 회원가입, 로그인 시 ==//
    // 밑에 생성자 파라미터에 정의한 내용을 넣어줌
    ALREADY_EXIST_NICKNAME(HttpStatus.BAD_REQUEST, "이미 존재하는 닉네임입니다.", SignType.MEMBER),
    WRONG_PASSWORD(HttpStatus.BAD_REQUEST, "비밀번호가 잘못되었습니다.", SignType.MEMBER),
    NOT_FOUND_MEMBER(HttpStatus.BAD_REQUEST, "회원 정보가 없습니다.", SignType.MEMBER);


    private final HttpStatus httpStatus;
    private final String errorMessage;
    private final SignType sign;

    MemberExceptionType(HttpStatus httpStatus, String errorMessage, SignType sign) {
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
