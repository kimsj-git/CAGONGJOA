package com.ssafy.backend.post.service;

import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@RequiredArgsConstructor // 얘도 커스텀?
@Service
@Transactional
public class PostServiceImpl implements PostService{

        private final PostRepository postRepository;
        private final MemberRepository memberRepository;
//    private final FileService fileService;
//    private final JwtUtil jwtUtil;



    /**    1. 글 등록    **/
    @Override
    public void writePost(PostWriteFormRequestDto postWriteDto) throws Exception {

        // 1-1. 유저 확인

        // 1-2. 파일 업로드

        // 1-3. 글 저장하기

            Post post = Post.postWriteBuilder()
            .memberId(postWriteDto.getMemberId())
            .content(postWriteDto.getContent())
            .type(postWriteDto.getType())
            .build();

            Post result =  postRepository.save(post);

/*       // 작성자 id는 서버에서 accessToken을 파싱해서 넣어준다.
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String accessToken = request.getHeader("Authorization");
        accessToken = accessToken.substring(7);
        DecodedJWT payload = jwtUtil.getDecodedJWT(accessToken);
        int userId = Integer.parseInt(payload.getAudience().get(0));
        UserDto registeredUser = userMapper.getUserById(userId);

        // 등록된 회원이 아니면 글 쓰기 권한 없음!
        if (registeredUser == null) {
            throw new BaseException("접근 권한이 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        postDto.setUserId(userId);

        if(postDto.getTitle() == null || postDto.getContent() == null) {
            throw new BaseException("제목 또는 내용을 입력하세요.", HttpStatus.BAD_REQUEST);
        }
        return boardMapper.writeArticle(boardDto) == 1;*/
    }


    /**    2. 글 업데이트    **/
    @Override
    public void updatePost(PostWriteFormRequestDto postDto) {

        // 1. 글 업데이트
        Long postId = postDto.getPostId();
        String content = postDto.getContent();

        Optional<Post> updateResult = postRepository.findById(postId);
        Post post = updateResult.orElseThrow();

        post.updateContents(content);

        // 2. 이미지 업데이트 (나중구현)

        postRepository.save(post);

    }


    /**    3. 글 삭제    **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deletePost(Long postId) {

        postRepository.deleteById(postId);

    }

    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**    4. 글 조회 (1건 / 상세)    **/
    @Override
    public void findOnePost(Long postId) {

        Optional<Post> selectResult = postRepository.findById(postId);

        Post post = selectResult.orElseThrow();


    }

    @Override
    public void findAllPost(Long memberId) throws Exception {

        Optional<Post> selectAllResult = postRepository.findByMemberId(memberId);

        Post post = selectAllResult.orElseThrow();

        System.out.println(post);
    }
}
