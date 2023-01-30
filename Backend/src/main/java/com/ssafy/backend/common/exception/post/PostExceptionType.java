package com.ssafy.backend.common.exception.post;

import com.ssafy.backend.common.exception.BaseExceptionType;
import org.springframework.http.HttpStatus;

public class PostExceptionType implements BaseExceptionType {

    /**  글쓰기 시   **/


    /**  이미지 첨부 시  **/
    
    
    /**  댓글 작성 시  **/

    private final HttpStatus httpStatus;
    private final String errorMessage;

    PostExceptionType(HttpStatus httpStatus, String errorMessage) {
        this.httpStatus = httpStatus;
        this.errorMessage = errorMessage;
    }
    @Override
    public HttpStatus getHttpStatus() {
        return this.httpStatus;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }
}
