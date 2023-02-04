package com.ssafy.backend.common.exception;

import com.ssafy.backend.common.dto.ResponseDTO;
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
    public ResponseEntity<ResponseDTO> handleBaseEx(BaseException exception){
        log.error("BaseException errorMessage(): {}",exception.getExceptionType().getErrorMessage());
        log.error("BaseException HttpStatus(): {}",exception.getExceptionType().getHttpStatus());

        ResponseDTO responseDTO = ResponseDTO.builder()
                .errMsg(exception.getExceptionType().getErrorMessage())
                .httpStatus(exception.getExceptionType().getHttpStatus())
                .data(null)
                .build();

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO> handleMemberEx(Exception exception){

        ResponseDTO responseDTO = ResponseDTO.builder()
                .errMsg("server error..")
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .data(null)
                .build();

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}