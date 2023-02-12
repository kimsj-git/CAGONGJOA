package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {

    /** 0. 유저 확인  **/
//    public long userTest() throws Exception;

    /** 1. 게시글 등록  **/
    Long writePost(MultipartFile[] files, PostWriteFormRequestDto postDto);

    /** 2. 게시글 수정  요청 **/


    /** 3. 게시글 수정  **/
    boolean updatePostForm(MultipartFile[] files, PostUpdateFormRequestDto postDto);

    /** 3. 게시글 삭제  **/
    void deletePost(Long postId);

    /** 4. 게시글 1개 조회  **/
    PostDetailResponseDto findOnePost(Long postId);

    /** 5. 게시글 10개씩 조회  **/
    List<PostPagingResponseDto> feedPosts(PostPagingRequestDto requestDto, Pageable pageable);

    /** 6. 게시글 좋아요  **/
    PostLikeResponseDto likePost(PostLikeRequestDto likeRequestDto);

    /** 7. 게시글 업데이트  **/
    PostUpdateResponseDto updatePost(Long postId);
    /** 8. 게시글 검색  **/
    List<PostSearchResponseDto> searchPost(PostSearchRequestDto requestDto, Pageable pageable);
}
