package com.ssafy.backend.post.domain.dto;


import com.ssafy.backend.post.domain.enums.Type;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWriteFormRequestDto {

    /**   2. 글 등록 요청       **/

    private String nickname; // nickname 을 받아서 사용
    private Long memberId; // 테스팅시에만 사용, 추후 삭제
    private String content;
    private Type type;
    private MultipartFile[] files;




}