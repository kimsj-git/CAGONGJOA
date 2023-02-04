package com.ssafy.backend.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity handleBaseEx(BaseException exception){
        log.error("BaseException errorMessage(): {}",exception.getExceptionType().getErrorMessage());
        log.error("BaseException HttpStatus(): {}",exception.getExceptionType().getHttpStatus());

        return new ResponseEntity(exception.getMessage(), exception.getExceptionType().getHttpStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity handleMemberEx(Exception exception){
        exception.printStackTrace();
        return new ResponseEntity("서버 에러 발생", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}