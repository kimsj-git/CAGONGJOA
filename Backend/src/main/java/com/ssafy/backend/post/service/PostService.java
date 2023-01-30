package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;

public interface PostService {

    /** 1. 게시글 등록  **/
    void writePost(PostWriteFormRequestDto postDto) throws Exception;

    /** 2. 게시글 수정 **/
    void updatePost(PostWriteFormRequestDto postDto) throws Exception;

    /** 3. 게시글 삭제  **/
    void deletePost(Long postId) throws Exception;

    /** 4. 게시글 1개 조회  **/
    void findOnePost(Long postId) throws Exception;

    /** 5. 게시글 전부 조회  **/
    void findAllPost(Long memberId) throws Exception;

    /** 6. 게시글 페이징  **/
//    PostPagingDto getPostList(Pageable pageable, PostSearchCondition postSearchCondition);
}
