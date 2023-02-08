package com.ssafy.backend.post.service;

import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.cafe.service.CafeServiceImpl;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.service.MemberServiceImpl;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.*;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@RequiredArgsConstructor // 얘도 커스텀?
@Service
@Transactional
public class PostServiceImpl implements PostService {
    // Repository
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    // Entity & Dto
    private Slice<Post> postSlice;
    private PostCafe postCafe;
    private List<String> imgUrlPaths;
    // Util
    private final PostUtil postUtil;
    private final CafeServiceImpl cafeService;
    private final MemberServiceImpl memberService;
    private final CafeAuthRepository cafeAuthRepository;
    private final CafeRepository cafeRepository;

    /**
     * 1. 글 등록 [ 테스트 완료 ]
     **/
    @Override
    public boolean writePost(MultipartFile[] files, PostWriteFormRequestDto requestDto) throws Exception {

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();

        // 1-2. 글 저장하기

        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Member member = optionalMember.orElseThrow();
        String content = requestDto.getContent();
        System.out.println("content : " + content);

        // 1-3. 이미지 업로드 Build
        Post post;
        post = Post.postWriteBuilder()
                .member(member)
                .content(content)
                .postType(requestDto.getType())
                .build();

        if (files != null) {
            List<PostImage> postImages = postUtil.imageUpload(files);
            for (PostImage postImage : postImages) {
                post.addPostImage(postImage);
            }
        }
        
        // 1-4. 유저 인증여부 확인
        Optional<CafeAuth> cafeAuth = cafeAuthRepository.findById(checked.getNickname());
        if (cafeAuth.isEmpty() || cafeAuth == null) { // 카페 이름이 없으면 - 인증되지 않은 유저
            if (requestDto.getType() == PostType.qna || requestDto.getType() == PostType.lost) { // 카테고리가 둘중 하나면 넘어가기
                ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude,longitude,dist);
                List<NearByCafeResultDto> resultDtoList =  cafeService.getNearByCafeLocations(clientPosInfoDto);
                for (NearByCafeResultDto resultDto : resultDtoList) {
                    postCafe = PostCafe.PostCafeBuilder()
                            .post(post)
                            .cafe(cafeRepository.findById(resultDto.getId().longValue()).get())
                            .build();
                    post.addPostCafe(postCafe);
                }


            } else { // 그렇지 않다면 false
                return false;
            }
        }else { // 카페이름이 있으면 - 인증된 유저
            Cafe cafe = cafeRepository.findById(cafeAuth.get().getCafeId()).get(); // 카페 닉네임을 확인한다.
            String cafeNickname = cafe.getName();

            // 1-3. 카페위치 저장하기

            postCafe = PostCafe.PostCafeBuilder()
                    .post(post)
                    .cafe(cafe)
                    .build();
            post.addPostCafe(postCafe);
        }

        postRepository.save(post);
        return true;
    }

    /**
     * 3. 글 삭제 [ Cascade 테스트 필요 ]
     **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**
     * 4. 글 전체 조회 (10개) [확인완료]
     **/
    @Override
    public List<PostPagingResponseDto> feedPosts(PostPagingRequestDto requestDto, Pageable pageable) throws Exception {

        // 1. 유저 기본사항을 체크한다. OK
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
//        CafeAuth cafeAuth = cafeAuthRepository.findById(checked.getNickname()).get();
//        String nickName = checked.getNickname(); // 인증되었을 때 유저 닉네임을 가져온다.

        // 2. request Dto 값들 체크 - OK
        Long postId = requestDto.getPostId();
        List<PostType> types = requestDto.getTypes();
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();
        System.out.println(latitude + " " + longitude + " " + dist);

        // 3. 주변 카페들 정보 알아오기 - 주변 카페에 해당되는 글들만 된다. - Map 객체가 너무 많이 만들어진다. 리팩터링 필요
        ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
        List<NearByCafeResultDto> nearByCafeResultDtos = cafeService.getNearByCafeLocations(clientPosInfoDto);

        if(nearByCafeResultDtos.isEmpty() || nearByCafeResultDtos == null) {
            System.out.println("주변 카페가 없음?");
        }else {
            System.out.println(" 총몇개? : " + nearByCafeResultDtos.size() + "개       " + nearByCafeResultDtos);
        }
        // cafe id 와 name 만 전달해줄거임
        List<Long> cafeIdList = new ArrayList<>();
        for (NearByCafeResultDto dto : nearByCafeResultDtos) {
            cafeIdList.add(dto.getId().longValue());
        }
        
        if(types.contains("hot")) { // 핫 게시물을 포함하고 있을 때

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("hot 새로고침");
                postSlice = postRepository.findAllByPostTypeInAndPostCafeList_CafeIdIn(types, cafeIdList, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("hot 두번째이상 요청");
                postSlice = postRepository.findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(postId,types,cafeIdList,pageable);
                // 갖고올 게시물이 없으면
            }


        } else { //

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("새로고침");
                postSlice = postRepository.findAllByPostTypeInAndPostCafeList_CafeIdIn(types, cafeIdList, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("두번째이상 요청");
                postSlice = postRepository.findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(postId,types,cafeIdList,pageable);
                // 갖고올 게시물이 없으면
            }
            
        }
//         post를 slice 형태로 갖고오기

        if (postSlice.isEmpty() || postSlice == null) { // 불러올 게시물이 있을때
            System.out.println("널이래용");
            return null;
        }

        // 5. 리턴값 채워넣기
        List<PostPagingResponseDto> postResponseDtoList = new ArrayList<>();
        Post post;
        for (Post slice : postSlice) {

            Optional<Post> optionalPost = postRepository.findById(slice.getId());
            post = optionalPost.get();
            List<PostImage> postImages = post.getPostImageList();
            String cafeName = cafeRepository.findById(slice.getPostCafeList().get(0).getCafe().getId()).get().getName(); // 인증된 유저만 리턴

            List<String> imgUrlPath = new ArrayList<>();
            for (PostImage postImage : postImages) {
                imgUrlPath.add(postImage.getImgUrl());
            }
            int postLikeCount = post.getPostLikeList().size();
            int commentCount = post.getCommentList().size();

            PostPagingResponseDto postPagingResponseDto = PostPagingResponseDto.builder()
                    .postId(slice.getId())
                    .imgUrlPath(imgUrlPath)
                    .createdAt(post.getCreatedAt())
                    .content(post.getContent())
                    .commentCount(commentCount)
//                    .cafeName(cafeName)
//                    .exp()
                    .writerNickname(post.getMember().getNickname())
                    .postLikeCount(postLikeCount)
                    .build();
            postResponseDtoList.add(postPagingResponseDto);
        }

        return postResponseDtoList;
    }

    /**
     * 4. 상세페이지 조회
     **/
    @Override
    public PostDetailResponseDto findOnePost(Long postId) throws Exception {

        // 1. 로그인된 유저의 정보를 확인한다.
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        String nickname = checked.getNickname();
        boolean isCafeAuthorized;
        Optional<CafeAuth> cafeAuth = cafeAuthRepository.findById(nickname);
        if (cafeAuth.isEmpty() || cafeAuth == null) { // 카페 이름이 없으면 - 인증되지 않은 유저
            isCafeAuthorized = false;
        }else{
        Cafe cafe = cafeRepository.findById(cafeAuth.get().getCafeId()).get(); // 카페 닉네임을 확인한다.
        String cafeName = cafe.getName();
            isCafeAuthorized = true;
        }

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post;
        if (postOptional == null || postOptional.isEmpty()) {
            // 잘못된 postId 형식
            return null;
        }
        post = postOptional.orElseThrow();

        imgUrlPaths = new ArrayList<>();
        for (PostImage postImage : post.getPostImageList()) {
            imgUrlPaths.add(postImage.getImgUrl());
        }
        Slice<Comment> commentSlice = commentRepository.findAllByPostId(postId);

        PostDetailResponseDto detailResponseDto = PostDetailResponseDto.builder()
                .nickname(nickname)
                .isCafeAuthorized(isCafeAuthorized)
                .postId(postId)
                .createdAt(post.getCreatedAt())
                .postContent(post.getContent())
                .imgPathList(imgUrlPaths)
                .commentSlice(commentSlice)
                .likeCounts(post.getPostLikeList().size())
                .commentCounts(post.getCommentList().size())
                .build();
        return detailResponseDto;
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
        Post post;
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

    @Override
    public PostUpdateResponseDto updatePost(Long postId) {
    Post post;
    post = postRepository.findById(postId).get();
    List<PostImage> postImageList = post.getPostImageList();
    List<Map.Entry<String,String>> imgList = new ArrayList<>();
        for (PostImage postImage: postImageList) {
            imgList.add(new AbstractMap.SimpleEntry<>(postImage.getAccessKey(),postImage.getImgUrl()));
        }
    PostUpdateResponseDto postUpdateResponseDto = PostUpdateResponseDto.builder()
            .postId(postId)
            .imgPathList(imgList)
            .type(post.getPostType())
            .Content(post.getContent())
            .build();

    return postUpdateResponseDto;

    }

    /**
     * 2. 글 업데이트 [ 테스트 완료 ]
     **/
    @Override
    public boolean updatePostForm(MultipartFile[] files, PostUpdateFormRequestDto updateDto) throws Exception {

        // 1. 글 업데이트
        Long postId = updateDto.getPostId();
        String content = updateDto.getContent();
        List<String> keyNameList = updateDto.getKeyNameList();

        Optional<Post> updateResult = postRepository.findById(postId);
        if (updateResult == null || updateResult.isEmpty()) {
            return false;
        }
        Post post = updateResult.orElseThrow();
        post.updateContents(content);

        // 2. 이미지 업데이트
        postUtil.imageDelete(post, keyNameList);
        if (files != null) {
            List<PostImage> postImages = postUtil.imageUpload(files);
            for (PostImage postImage : postImages) {
                post.addPostImage(postImage);
            }
        }
        postRepository.save(post);
        return true;
    }
}
