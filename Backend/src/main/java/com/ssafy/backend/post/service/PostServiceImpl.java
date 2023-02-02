package com.ssafy.backend.post.service;

import com.amazonaws.services.s3.AmazonS3;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.*;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.PostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;

@RequiredArgsConstructor // 얘도 커스텀?
@Service
@Transactional
public class PostServiceImpl implements PostService {
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final AmazonS3 amazonS3;
    private final PostRepository postRepository;
    private final ImageRepository imageRepository;
    // Pageable 객체를 하나만 만든다. - 여러 api 요청들에서 사용할 수 있게
    private Slice<Post> postSlice;


    private final JwtUtil jwtUtil;
    private final PostUtil postUtil;
    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;


    public long userTest() throws Exception {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String accessToken = request.getHeader("Authorization");
        System.out.println("어세스토큰 : " + accessToken);
        accessToken = accessToken.substring(7);
        DecodedJWT payload = jwtUtil.getDecodedJWT(accessToken);
        long memberId = Integer.parseInt(payload.getAudience().get(0));
        System.out.println(memberId);
        return memberId;

    }

    @Override
    /**    0. 유저 확인   **/
    public Map.Entry<Long, Boolean> checkMember() throws Exception {

        // 1. 실제 DB에 저장된 닉네임과 맞는지 확인
        // 2. 맞으면 DB에서 사용자의 id 를 가져오기 (pk)
//        long memberId = postUtil.userTest();


        Long memberId = 1L;
        //Long memberId = postRepository.findByMemberId();
        // 3. 카페 인증된 회원인지 확인
        boolean isCafeAuthorized = true;

        return new AbstractMap.SimpleEntry<>(memberId, isCafeAuthorized);
    }


    /**
     * 1. 글 등록
     **/
    @Override
    public boolean writePost(PostWriteFormRequestDto postWriteDto) throws Exception {

        //1. 유저 확인
        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        // 1-2. 이미지 업로드
        MultipartFile[] files = postWriteDto.getFiles();

        List<String> imagePathUrl = postUtil.imageUpload(files);

        // 1-3. 글 저장하기

        if (isCafeAuthorized) {
            // 인증된 유저의 경우, 카테고리를 제한하지 않는다.

        } else {
            // 인증되지 않은 유저의 경우, 카테고리를 두개로 제한한다.
        }

        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Member member = optionalMember.orElseThrow();

        Post post = Post.postWriteBuilder()
                .member(member)
                .content(postWriteDto.getContent())
                .type(postWriteDto.getType())
                .build();

        postRepository.save(post);
        return true;
    }


    /**
     * 2. 글 업데이트
     **/
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

    /**
     * 3. 글 삭제
     **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);

    }

    @Override
    public void findOnePost(Long postId, String nickname) throws Exception {

    }

    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**
     * 4. 글 조회 (1건 / 상세)
     **/
//    @Override
//    public void findOnePost(Long postId, String nickname) throws Exception {
//        // 1. 유저 확인
//        System.out.println(nickname);
//        Map.Entry<Long, Boolean> checked = checkMember();
//        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
//        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.
//        System.out.println(memberId + " " + isCafeAuthorized);
//
//        // 2. 글 불러오기
//        Optional<Post> findOneResult = postRepository.findByMemberId(memberId);
//
//        Post post = findOneResult.orElseThrow();
//
//        // 3. 리턴
//        System.out.println(post);
//
//    }

    /**
     * 5. 글 전체 조회 (20개)
     **/
    @Override
    public Slice<Post> findAllPost(Long postId, Pageable pageable) throws Exception {

        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        if(postId == -1) {
            // Default 값으로 진행
        }else {

            postSlice = postRepository.findAllByIdLessThanAndMemberId(postId, memberId, pageable);
            
            if(postSlice.isEmpty() || postSlice == null) {
                System.out.println("널이래용");
            }
//            postSlice = postRepository.findAllByMemberId(memberId);
        }

        return postSlice;
    }

    /**
     * 6. 다음글내놔 벅벅
     **/
    @Override
    public void nextPost() {

    }

    /**
     * 7. 게시글 좋아요
     **/
    @Override
    public Map.Entry<Boolean, Long> likePost(Long postId, Boolean isChecked) throws Exception {


        //1. 유저 확인
        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.
        Boolean responseIsChecked;

        if (!isChecked) {
            PostLike postLike = PostLike.PostLikeBuilder()
                    .postId(postId)
                    .memberId(memberId)
                    .build();
            postLikeRepository.save(postLike);
            responseIsChecked = true;
        } else {
            postLikeRepository.deleteByPostIdAndMemberId(postId, memberId);
            responseIsChecked = false;
        }

        Long count = postLikeRepository.countByPostId(postId);
        return new AbstractMap.SimpleEntry<>(responseIsChecked, count);
    }


    /**
     * 2-1. 댓글 쓰기
     **/
    @Override
    public void writeComment(CommentWriteRequestDTO commentWriteDto) throws Exception {
        //1. 유저 확인
        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        Long postId = commentWriteDto.getPostId();
        String content = commentWriteDto.getContent();
        Long group = commentWriteDto.getGroup();

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow();
        // 1-3. 글 저장하기

        Comment comment = Comment.CommentWriteBuilder()
                .post(post)
                .memberId(memberId)
                .content(content)
                .group(group)
                .build();

        // 인증 여부에 따라 글을 쓸수있다 - GeoAuth
        commentRepository.save(comment);

    }


    /**
     * 2-2. 댓글 업데이트
     **/


    @Override
    public void updateComment(CommentUpdateRequestDTO commentUpdateDto) throws Exception{
        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.

        Long id = commentUpdateDto.getCommentId();
        String content = commentUpdateDto.getContent();


        Comment comment = Comment.CommentWriteBuilder()
                .id(id)
                .content(content)
                .build();

        commentRepository.save(comment);
    }

    /**
     * 3. 댓글 좋아요
     **/
    @Override
    public Map.Entry<Boolean, Long> likeComment(Long commentId, Boolean isChecked) throws Exception {
        Boolean responseIsChecked;

        //1. 유저 확인
        Map.Entry<Long, Boolean> checked = checkMember();
        long memberId = checked.getKey(); // 멤버 아이디를 확인한다.
        boolean isCafeAuthorized = checked.getValue(); // 카페 인증 여부를 확인한다.


        // False 라면 생성

        if (!isChecked) {
            CommentLike commentLike = CommentLike.CommentLikeBuilder()
                    .commentId(commentId)
                    .memberId(memberId)
                    .build();
            commentLikeRepository.save(commentLike);
            responseIsChecked = true;
        }
        // True 라면 삭제
        else {
            commentLikeRepository.deleteByCommentIdAndMemberId(commentId, memberId);
            responseIsChecked = false;
        }
        Long count = commentLikeRepository.countCommentLikeByCommentId(commentId);

        return new AbstractMap.SimpleEntry<>(responseIsChecked, count);
    }

    /**
     * 4. 댓글 삭제
     **/

    @Override
    public void deletecomment(Long commentId) {

        commentRepository.deleteById(commentId);

    }
}
