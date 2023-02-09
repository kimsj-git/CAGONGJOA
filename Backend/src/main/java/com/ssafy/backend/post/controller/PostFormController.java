package com.ssafy.backend.post.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.dto.ResponseDTO;
import com.ssafy.backend.post.domain.dto.PostUpdateFormRequestDto;
import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/writeForm")
@RequiredArgsConstructor
public class PostFormController {

    private final PostService postService;
    private ResponseDTO responseDTO;

    /**
     * 3-1. 글 등록 요청 [이미지 + 글 테스트완료 - 위치인증 값 필요]
     **/

    @Auth
    @PostMapping("/write")
    public ResponseEntity<ResponseDTO> postSave(
            @RequestPart(value = "imgFiles", required = false) MultipartFile[] files,
            @RequestPart(value = "writeForm") PostWriteFormRequestDto requestPostDto) throws Exception {

        Long postId = postService.writePost(files, requestPostDto);
        if ( postId != -1L) {
            responseDTO = new ResponseDTO("글쓰기 완료!", "", HttpStatus.OK, postId);
        } else {
            responseDTO = new ResponseDTO("", "code : 404 / 잘못된 카테고리 요청 / 미인증 유저가 2개 카테고리 이외를 시도함 ", HttpStatus.NOT_FOUND, null);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    /**
     * 3-2. 게시글 수정  [이미지 + 글 테스트완료 - 위치인증 값 필요] - 자랑하기까지 요걸로 퉁
     **/
    @Auth
    @PutMapping ("/update")

    public ResponseEntity<ResponseDTO> postUpdate(
            @RequestPart(value = "imgFiles", required = false) MultipartFile[] files,
            @RequestPart(value = "updateForm", required = false) PostUpdateFormRequestDto updateDto) throws Exception {

        boolean isUpdated = postService.updatePostForm(files, updateDto);
        if (isUpdated) {
            responseDTO = new ResponseDTO("글 업데이트 완료!", "", HttpStatus.OK, null);
        } else {
            responseDTO = new ResponseDTO("", "잘못된 글 id", HttpStatus.BAD_REQUEST, null);
        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

}
