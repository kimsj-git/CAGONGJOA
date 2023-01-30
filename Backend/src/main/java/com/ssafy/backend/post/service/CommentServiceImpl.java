package com.ssafy.backend.post.service;

import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.domain.dto.CommentWriteFormRequestDTO;
import com.ssafy.backend.post.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService{

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
//    private final FileService fileService;
//    private final JwtUtil jwtUtil;



    /**    1. 댓글 등록    **/
    @Override
    public void writeComment(CommentWriteFormRequestDTO commentDTO) throws Exception {

        // 1-1. 유저 확인

        // 1-2. 파일 업로드

        // 1-3. 글 저장하기

/*        Post post = Post.builder()
                .memberId(commentDTO.getMemberId())
                .content(commentDTO.getContent())
                .type(commentDTO.getType())
                .build();*/

//        Post result =  postRepository.save(post);
    }


    /**    2. 글 업데이트    **/
    @Override
    public void updateComment(CommentWriteFormRequestDTO commentDTO) throws Exception{

/*        // 1. 글 업데이트
        Long postId = postDto.getPostId();
        String content = postDto.getContent();

        Optional<Post> updateResult = postRepository.findById(postId);
        Post post = updateResult.orElseThrow();

        post.updateContents(content);

        // 2. 이미지 업데이트 (나중구현)

        postRepository.save(post);*/

    }


    /**    3. 글 삭제    **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deleteComment(Long id) {

        commentRepository.deleteById(id);

    }

    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**    4. 글 조회 (1건 / 상세)    **/
    @Override
    public void findOneComment(Long id) {

/*        Optional<Post> selectResult = postRepository.findById(postId);

        Post post = selectResult.orElseThrow();
        // null 이라면
        if(post == null) {
            System.out.println("널이야");
            // 리턴하기
        }
        // null 이 아니라면
        else {
            // 내용, 사진, 댓글 을 리턴하기
            System.out.println(post);
        }*/

    }

    @Override
    public void findAllComment(Long memberId) throws Exception {

    }

}
