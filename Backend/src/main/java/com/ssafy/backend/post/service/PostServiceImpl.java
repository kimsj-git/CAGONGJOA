package com.ssafy.backend.post.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.service.CafeServiceImpl;
import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.*;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.PostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
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
    private final PostRepository postRepository;
    private Slice<PostPagingResponseDto> postSlice;
    private Post post;

    private final JwtUtil jwtUtil;
    private final PostUtil postUtil;
    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final ImageRepository imageRepository;

    private CafeServiceImpl cafeService;

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

    /**
     * 1. 글 등록
     **/
    @Override
    public boolean writePost(MultipartFile[] files, PostWriteFormRequestDto postWriteDto) throws Exception {

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        String cafeName = checked.getCafeName(); // 카페 닉네임을 확인한다.
        if (cafeName.isEmpty() || cafeName == "CafeNotAuthorized") { // 카페 이름이 없으면 - 인증되지 않은 유저
            if (postWriteDto.getType() != PostType.QNA || postWriteDto.getType() != PostType.LOST) { // 카테고리가 둘중하나라도 아니면 fail
                return false;
            }
        }

        // 1-2. 글 저장하기

        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Member member = optionalMember.orElseThrow();
        String content = postWriteDto.getContent();
        System.out.println("content : " + content);


        // 1-3. 이미지 업로드
        if (files != null) {

            List<PostImage> postImages = postUtil.imageUpload(post, files);

            post = Post.postWriteBuilder()
                    .member(member)
                    .content(content)
                    .postType(postWriteDto.getType())
                    .postImageList(postImages)
                    .build();
        } else {
            post = Post.postWriteBuilder()
                    .member(member)
                    .content(content)
                    .postType(postWriteDto.getType())
                    .build();
        }

        return true;
    }


    /**
     * 2. 글 업데이트
     **/
    @Override
    public void updatePost(MultipartFile[] files, PostUpdateFormRequestDto updateDto) throws Exception {

        // 1. 글 업데이트
        Long postId = updateDto.getPostId();
        String content = updateDto.getContent();

        Optional<Post> updateResult = postRepository.findById(postId);
        Post post = updateResult.orElseThrow();

        post.updateContents(content);

        postRepository.save(post);

        // 2. 이미지 업데이트s
        postUtil.imageDeleteAll(post);
        if (files != null) {
            postUtil.imageUpload(post, files);
        }
    }

    /**
     * 3. 글 삭제
     **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);

    }


    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**
     * 4. 글 전체 조회 (10개)
     **/
    @Override
    public Slice<PostPagingResponseDto> feedPosts(PostPagingRequestDto requestDto, Pageable pageable) throws Exception {

        // 1. 유저 기본사항을 체크한다.
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        String cafeName = checked.getCafeName(); // 인증되었을때 카페 이름을 확인한다.
        String nickName = checked.getNickname();

        // 2. 값들 체크
        Long postId = requestDto.getPostId();
        List<String> types = requestDto.getTypes();
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();

        // 3. 주변 카페들 정보 알아오기
        ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
        List<NearByCafeResultDto> nearByCafeResultDtos = cafeService.getNearByCafeLocations(clientPosInfoDto);

        // 4. 백엔드 로직
        for (NearByCafeResultDto dto : nearByCafeResultDtos) {

        }
        Optional<Post> optionalPost = postRepository.findById(postId);
        post = optionalPost.orElseThrow();


        List<PostImage> postImages = post.getPostImageList();

        List<String> imgUrlPath = new ArrayList<>();
        for (PostImage postImage : postImages) {
            imgUrlPath.add(postImage.getImgUrl());
        }
        int postLikeCount = post.getPostLikeList().size();
        int commentCount = post.getCommentList().size();


        // 5. 리턴값 채워넣기
        PostPagingResponseDto postPagingResponseDto = PostPagingResponseDto.builder()
                .postId(postId)
                .nickname(nickName)
                .imgUrlPath(imgUrlPath)
                .createdAt(post.getCreatedAt())
                .content(post.getContent())
                .commentCount(commentCount)
                .postLikeCount(postLikeCount)
                .build();


        if (postId == -1) {
            // 처음 요청할때 (refresh)
            postSlice = postRepository.findAllByMemberId(memberId, types, pageable);
        } else {
            // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
            postSlice = postRepository.findAllByIdLessThanAndMemberId(postId, memberId, types, pageable);

            // 갖고올 게시물이 없으면
            if (postSlice.isEmpty() || postSlice == null) {
                System.out.println("널이래용");
            }
        }
        return postSlice;
    }

    /**
     * 4. 상세페이지 조회
     **/
    @Override
    public void findOnePost(Long postId) throws Exception {

        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        Optional<Post> postOptional = postRepository.findById(postId);
        post = postOptional.orElseThrow();

        List<Comment> commentList = commentRepository.findAllByPost(post);

        List<PostImage> postImageOptional = imageRepository.findAllByPostId(postId);

        List<String> imgUrlLinks;


    }

    /**
     * 7. 게시글 좋아요
     **/
    @Override
    public PostLikeResponseDto likePost(PostLikeRequestDto likeRequestDto) throws Exception {

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        Long postId = likeRequestDto.getPostId();
        Boolean isChecked = likeRequestDto.getIsChecked();

        Boolean responseIsChecked;

        Optional<Post> postOptional = postRepository.findById(postId);

        post = postOptional.orElseThrow();

        System.out.println("isChecked : " + likeRequestDto.getIsChecked());
        if (!isChecked) {// 눌려있지 않다면 누른다음에, 좋아요 DB에 추가를 한다
            if (postLikeRepository.findByPostIdAndMemberId(postId, memberId) == null) { // null 이면 맞음
                PostLike postLike = PostLike.PostLikeBuilder()
                        .post(post)
                        .memberId(memberId)
                        .build();
                postLikeRepository.save(postLike);
                // false -> true 로 바꿔서 반환
                responseIsChecked = true;
                System.out.println("postLike 생성완료");
            } else {// 유효성체크 : 안눌러져있는데, 또 누르기요청 : 에러발생
                System.out.println("postLike 에러");
                return null;
            }
        } else {
            // true - > DB 의 값을 삭제한다
            System.out.println("postLike 삭제");
            postLikeRepository.deleteByPostIdAndMemberId(postId, memberId);
            // true -> false
            responseIsChecked = false;
        }

        int count = postLikeRepository.countByPostId(postId);
        PostLikeResponseDto response = PostLikeResponseDto.builder()
                .postId(postId)
                .isChecked(responseIsChecked)
                .likeCount(count)
                .build();
        return response;
    }


}
