package com.ssafy.backend.post.controller;

import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.post.domain.dto.PostUpdateFormRequestDto;
import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/writeForm")
@RequiredArgsConstructor
public class PostFormController {

    private final PostService postService;

    /**  3-1. 글 등록 요청  [테스트완료] **/

//    @Auth
    @PostMapping("/write")
    public ResponseEntity<Void> postSave(@ModelAttribute PostWriteFormRequestDto requestPostDto) throws Exception {

        if(postService.writePost(requestPostDto)) { // 위치인증된 유저
            return new ResponseEntity<>(HttpStatus.OK);
        }else { // 위치인증 되지 않은 유저
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }


    /**  3-2. 게시글 수정  [테스트완료] **/
    @Auth
    @PostMapping("/updateForm")

    public ResponseEntity<Void> postUpdate(@RequestBody PostUpdateFormRequestDto updateDto) throws Exception {

        postService.updatePost(updateDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
