package com.ssafy.backend.common.exception.todaycafe;

import com.ssafy.backend.common.exception.BaseExceptionType;
import com.ssafy.backend.common.exception.enums.SignType;
import org.springframework.http.HttpStatus;

public enum TodayCafeExceptionType implements BaseExceptionType {
    //== 회원가입, 로그인 시 ==//
    // 밑에 생성자 파라미터에 정의한 내용을 넣어줌

    /**  POST  **/
    BAD_MEMBER_ID(HttpStatus.BAD_REQUEST, "해당 memberID 재확인이 필요합니다", SignType.TODAYCAFE),
    NOT_ENOUGH_10_BEAN(HttpStatus.NOT_ACCEPTABLE, "10 커피콩이 필요합니다.", SignType.TODAYCAFE),
    NOT_ENOUGH_27_BEAN(HttpStatus.NOT_ACCEPTABLE, "27 커피콩이 필요합니다.", SignType.TODAYCAFE),
    BAD_TYPE_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 타입 형태 입니다.", SignType.TODAYCAFE),
    NO_VISIT_LOG(HttpStatus.NO_CONTENT, "방문 일지가 없습니다", SignType.TODAYCAFE),
    NO_COFFEE(HttpStatus.NOT_ACCEPTABLE, "사용할 수 있는 커피가 부족합니다.", SignType.TODAYCAFE),
    SURVEY_ALREADY_SUBMITTED(HttpStatus.BAD_REQUEST, "이미 설문을 제출하였습니다.", SignType.TODAYCAFE),
    VISITED_AT_ERROR(HttpStatus.BAD_REQUEST, "방문일자 형식을 지켜주세요", SignType.TODAYCAFE),
    NO_CONTENT(HttpStatus.NO_CONTENT, "내용을 채워주세요", SignType.TODAYCAFE),
    ID_REQUIRED(HttpStatus.NO_CONTENT, "id 가 필요한 작업입니다", SignType.TODAYCAFE),
    BAD_ID(HttpStatus.BAD_REQUEST, "id 가 필요한 작업입니다", SignType.TODAYCAFE),
    CHECKED_NOT_CORRESPOND(HttpStatus.BAD_REQUEST, "체크값을 다시 확인해주세요", SignType.TODAYCAFE),
    UNKNOWN_ERROR(HttpStatus.BAD_REQUEST, "알수없는 에러", SignType.TODAYCAFE);

    private final HttpStatus httpStatus;
    private final String errorMessage;
    private final SignType sign;

    TodayCafeExceptionType(HttpStatus httpStatus, String errorMessage, SignType sign) {
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
