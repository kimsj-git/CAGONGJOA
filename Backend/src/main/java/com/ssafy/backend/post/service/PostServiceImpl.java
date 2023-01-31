package com.ssafy.backend.post.service;

import com.ssafy.backend.post.domain.dto.PagingRequestDto;
import com.ssafy.backend.post.domain.dto.PostUpdateFormRequestDto;
import com.ssafy.backend.post.domain.dto.PostWriteFormRequestDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor // 얘도 커스텀?
@Service
@Transactional
public class PostServiceImpl implements PostService{

        private final PostRepository postRepository;

//    private final FileService fileService;
//    private final JwtUtil jwtUtil;

    /**    0. 유저 확인   **/
    @Override
    public Map.Entry<Long, Boolean> checkMember(String nickname) throws Exception {

        // 1. 실제 DB에 저장된 닉네임과 맞는지 확인

        // 2. 맞으면 DB에서 사용자의 id 를 가져오기 (pk)
        Long memberId = postRepository.findByNickname(nickname).get().getId();
        // 3. 카페 인증된 회원인지 확인
        boolean isCafeAuthorized = false;


    return new AbstractMap.SimpleEntry<>(memberId, isCafeAuthorized);
    }



    /**    1. 글 등록    **/
    @Override
    public boolean writePost(PostWriteFormRequestDto postWriteDto) throws Exception {

        //1. 유저 확인
        Map.Entry<Long,Boolean> checked = checkMember(postWriteDto.getNickname());
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        // 1-2. 이미지 업로드

        // 1-3. 글 저장하기

            if(isCafeAuthorized) {
            // 인증된 유저의 경우, 카테고리를 제한하지 않는다.

            }else {
            // 인증되지 않은 유저의 경우, 카테고리를 두개로 제한한다.
            }

        Post post = Post.postWriteBuilder()
                .memberId(postWriteDto.getMemberId())
                .content(postWriteDto.getContent())
                .type(postWriteDto.getType())
                .build();

            Post result =  postRepository.save(post);

            return true;
    }


    /**    2. 글 업데이트    **/
    @Override
    public void updatePost(PostUpdateFormRequestDto updateDto) {

        // 1. 글 업데이트
        Long postId = updateDto.getPostId();
        String content = updateDto.getContent();
        //List<Image> images = updateDto.getImages();

        Optional<Post> updateResult = postRepository.findById(postId);
        Post post = updateResult.orElseThrow();

        post.updateContents(content);

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
    public void findOnePost(Long postId, String nickname) throws Exception{
        // 1. 유저 확인
        System.out.println(nickname);
        Map.Entry<Long,Boolean> checked = checkMember(nickname);
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.
        System.out.println(memberId + " " + isCafeAuthorized);

        // 2. 글 불러오기
        Optional<Post> findOneResult = postRepository.findByMemberId(memberId);

        Post post = findOneResult.orElseThrow();

        
        // 3. 리턴
        System.out.println(post);


    }
    /**    5. 글 전체 조회 (20개)    **/
    @Override
    public void findAllPost(PagingRequestDto requestDto) throws Exception {
        String nickname = requestDto.getNickname();
        System.out.println(nickname);
        Map.Entry<Long,Boolean> checked = checkMember(nickname);
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        System.out.println(memberId + " " + isCafeAuthorized);
        Optional<Post> selectAllResult = postRepository.findByMemberId(memberId);

        Post post = selectAllResult.orElseThrow();

        System.out.println(post);
    }
}
