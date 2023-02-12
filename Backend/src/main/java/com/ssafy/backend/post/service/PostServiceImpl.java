package com.ssafy.backend.post.service;

import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.cafe.service.CafeServiceImpl;
import com.ssafy.backend.common.exception.member.MemberException;
import com.ssafy.backend.common.exception.member.MemberExceptionType;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
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

import static com.ssafy.backend.common.exception.post.PostExceptionType.NO_CONTENT_POST_FORM;

@RequiredArgsConstructor // 얘도 커스텀?
@Service
@Transactional
public class PostServiceImpl implements PostService {
    // Repository
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final MemberRepository memberRepository;
    private final CafeAuthRepository cafeAuthRepository;
    private final CafeRepository cafeRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final PostCafeRepository postCafeRepository;
    // Util
    private final PostUtil postUtil;
    private final CafeServiceImpl cafeService;
    private final MemberServiceImpl memberService;
    private final ImageRepository imageRepository;

    /**
     * 1. 글 등록 [ 테스트 완료 ]
     **/
    @Override
    public Long writePost(MultipartFile[] files, PostWriteFormRequestDto requestDto) {

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();
        String content = requestDto.getContent();
        if (files != null || content != null) {

        } else {
            throw new PostException(NO_CONTENT_POST_FORM); // 이미지나 글 둘중 하나라도 없으면 에러
        }

        // 1-2. 멤버 불러오기
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        if (optionalMember.isEmpty() || optionalMember == null)
            throw new MemberException(MemberExceptionType.NOT_FOUND_MEMBER);
        Member member = optionalMember.get();

        // 1-3. 이미지 업로드 Build
        Post post = Post.postWriteBuilder()
                .member(member)
                .postType(requestDto.getType())
                .build();

        if (content != null) {
            post.updateContent(content);
        }

        Post savedPost = postRepository.save(post);

        if (files != null) {
            List<PostImage> postImages = postUtil.imageUpload(savedPost, files);
//            System.out.println(postImages);
            savedPost.updatePostImage(postImages);
            System.out.println("이미지도 첨부 완료");

        }
        // 1-4. 유저 인증여부 확인
        Optional<CafeAuth> cafeAuth = cafeAuthRepository.findById(checked.getNickname());
        if (cafeAuth.isEmpty() || cafeAuth == null) { // 카페 이름이 없으면 - 인증되지 않은 유저
            if (requestDto.getType() == PostType.qna || requestDto.getType() == PostType.lost) { // 카테고리가 둘중 하나면 넘어가기
                ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
                List<NearByCafeResultDto> resultDtoList = cafeService.getNearByCafeLocations(clientPosInfoDto);
                for (NearByCafeResultDto resultDto : resultDtoList) {
                    PostCafe postCafe = PostCafe.builder()
                            .post(savedPost)
                            .cafe(cafeRepository.findById(resultDto.getId().longValue()).get())
                            .build();
                    postCafeRepository.save(postCafe); // Post 가 너무 뚱뚱해지는걸 막기위해
                }

            } else { // 그렇지 않다면 false
                throw new PostException(PostExceptionType.NOT_ALLOWED_TYPE);
            }
        } else { // 카페이름이 있으면 - 인증된 유저
            System.out.println("글생성 : 여기까지 옴");
            Cafe cafe = cafeRepository.findById(cafeAuth.get().getCafeId()).get(); // 카페 닉네임을 확인한다.
            System.out.println("cafe 이름 : " + cafe.getName());
            savedPost.updateAuthorized();
            // 1-3. 카페위치 저장하기
            PostCafe postCafe = PostCafe.builder()
                    .post(savedPost)
                    .cafe(cafe)
                    .build();
            savedPost.addPostCafe(postCafe); // 인증된 카페의 경우, post 에 postCafe 저장해주기
        }

        return post.getId();
    }

    /**
     * 3. 글 삭제 [ Cascade 테스트 필요 ]
     **/

    // 3-1 게시글 하나 삭제
    @Override
    public void deletePost(Long postId) {

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty() || postOptional == null) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();
        long memberId = postUtil.checkMember().getMemberId();
        long writerId = post.getMember().getId();
        if (memberId != writerId) {
            throw new PostException(PostExceptionType.USER_IS_NOT_WRITER);
        }
        postRepository.deleteById(postId);
    }

    // 3-2 회원탈퇴 시 게시글 모두 삭제

    /**
     * 4. 글 전체 조회 (10개) [확인완료]
     **/
    @Override
    public List<PostPagingResponseDto> feedPosts(PostPagingRequestDto requestDto, Pageable pageable) {
        String cafeName;
        Slice<Post> postSlice;
        // 1. 유저 기본사항을 체크한다. OK
        CheckedResponseDto checked = postUtil.checkMember();

        // 2. request Dto 값들 체크 - OK
        Long postId = requestDto.getPostId();
        List<PostType> types = requestDto.getTypes();
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();

        // 3. 주변 카페들 정보 알아오기 - 주변 카페에 해당되는 글들만 된다.
        ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
        List<NearByCafeResultDto> nearByCafeResultDtos = cafeService.getNearByCafeLocations(clientPosInfoDto);

        if (nearByCafeResultDtos.isEmpty() || nearByCafeResultDtos == null) {
            throw new PostException(PostExceptionType.NO_CAFE_AROUND);
        } else {
            System.out.println(" 글 불러오기 - 주변 카페 개수 : " + nearByCafeResultDtos.size() + "개       " + nearByCafeResultDtos);
        }
        // cafe id 만 전달해줄거임
        List<Long> cafeIdList = new ArrayList<>();
        for (NearByCafeResultDto dto : nearByCafeResultDtos) {
            cafeIdList.add(dto.getId().longValue());
        }

        if (types.contains(PostType.hot)) { // 핫 게시물을 포함하고 있을 때

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("hot 첫번째요청");
                postSlice = postRepository.findHotPost(cafeIdList, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("hot 두번째이상 요청");
                postSlice = postRepository.findHotPostNext(cafeIdList, postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else { //

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("피드 첫번째 요청");
                postSlice = postRepository.findAllByPostTypeInAndPostCafeList_CafeIdIn(types, cafeIdList, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("두번째이상 요청");
                postSlice = postRepository.findAllByIdLessThanAndPostTypeInAndPostCafeList_CafeIdIn(postId, types, cafeIdList, pageable);
                // 갖고올 게시물이 없으면
            }

        }
//         post를 slice 형태로 갖고오기

        if (postSlice.isEmpty() || postSlice == null) { // 불러올 게시물이 있을때
            throw new PostException(PostExceptionType.NO_POST_FEED);
        }

        // 5. 리턴값 채워넣기
        List<PostPagingResponseDto> postResponseDtoList = new ArrayList<>();
        for (Post slice : postSlice) {
            Optional<Post> optionalPost = postRepository.findById(slice.getId());
            Post post = optionalPost.get();
            List<PostImage> postImages = post.getPostImageList();

            List<String> imgUrlPath = new ArrayList<>();
            for (PostImage postImage : postImages) {
                imgUrlPath.add(postImage.getImgUrl());
            }
            int postLikeCount = post.getPostLikeList().size();
            int commentCount = post.getCommentList().size();

            System.out.println("인증된카페? " + post.isCafeAuthorized());
            PostPagingResponseDto postPagingResponseDto = PostPagingResponseDto.builder()
                    .isCafeAuthorized(post.isCafeAuthorized())
                    .postId(slice.getId())
                    .imgUrlPath(imgUrlPath)
                    .createdAt(post.getCreatedAt())
                    .content(post.getContent())
                    .commentCount(commentCount)
                    .writerNickname(post.getMember().getNickname())
                    .postLikeCount(postLikeCount)
                    .build();

            if (post.isCafeAuthorized()) {
                if (post.getPostCafeList() == null || post.getPostCafeList().isEmpty()) {
                    throw new PostException(PostExceptionType.NO_POST_CAFE);
                }
                // 당연히 없지
                PostCafe postCafe = post.getPostCafeList().get(0); // 인증된 유저의 글쓰기 경우, postCafe 객체를 하나만 가지고있음
                Cafe cafe = postCafe.getCafe();
                Long cafeId = cafe.getId();
                String brandType = cafe.getBrandType();
                cafeName = cafe.getName();
                Long exp = memberCafeTierRepository.findByMemberIdAndCafeId(post.getMember().getId(), cafeId).get().getExp();
                postPagingResponseDto.updateDto(cafeName, exp, brandType);
            }
            postResponseDtoList.add(postPagingResponseDto);
        }
        return postResponseDtoList;
    }

    /**
     * 4. 상세페이지 조회
     **/
    @Override
    public PostDetailResponseDto findOnePost(Long postId) {
        // 1. 로그인된 유저의 정보를 확인한다.
        CheckedResponseDto checked = postUtil.checkMember();
        String nickname = checked.getNickname();

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional == null || postOptional.isEmpty()) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();

        List<String> imgUrlPaths = new ArrayList<>();
        for (PostImage postImage : post.getPostImageList()) {
            imgUrlPaths.add(postImage.getImgUrl());
        }

        PostDetailResponseDto detailResponseDto = PostDetailResponseDto.builder()
                .postId(postId)
                .nickname(nickname)
                .isCafeAuthorized(post.isCafeAuthorized())
                .createdAt(post.getCreatedAt())
                .type(post.getPostType())
                .postContent(post.getContent())
                .imgPathList(imgUrlPaths)
                .likeCounts(post.getPostLikeList().size())
                .commentCounts(post.getCommentList().size())
                .build();

        if (detailResponseDto.isCafeAuthorized()) {
            PostCafe postCafe = postCafeRepository.findByPostId(postId).get();
            Cafe cafe = postCafe.getCafe();
            MemberCafeTier memberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(post.getMember().getId(), cafe.getId()).get();
            detailResponseDto.updateDto(cafe.getName(), cafe.getBrandType(), memberCafeTier.getExp());
        }
        return detailResponseDto;
    }

    /**
     * 5. 게시글 좋아요
     **/
    @Override
    public PostLikeResponseDto likePost(PostLikeRequestDto likeRequestDto) {

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        Long postId = likeRequestDto.getPostId();
        Boolean isChecked = likeRequestDto.getIsChecked();

        Boolean responseIsChecked;

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty() || postOptional == null) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();
        Optional<PostLike> postLikeOptional = postLikeRepository.findByPostIdAndMemberId(postId, memberId);
        if (!isChecked) {// 눌려있지 않다면 누른다음에, 좋아요 DB에 추가를 한다

            if (postLikeOptional.isEmpty() || postLikeOptional == null) { // null 이면 맞음
                PostLike postLike = PostLike.PostLikeBuilder()
                        .post(post)
                        .memberId(memberId)
                        .build();
                postLikeRepository.save(postLike);
                // false -> true 로 바꿔서 반환
                responseIsChecked = true;
            } else {// 유효성체크 : 안눌러져있는데, 또 누르기요청 : 에러발생
                throw new PostException(PostExceptionType.POST_LIKE_CHECK_FAIL);
            }
        } else {
            // true - > DB 의 값을 삭제한다

            if (postLikeOptional == null || postLikeOptional.isEmpty()) {
                throw new PostException(PostExceptionType.POST_LIKE_CHECK_FAIL);
            }
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

    /**
     * 6. 게시글 업데이트로 가기
     **/
    @Override
    public PostUpdateResponseDto updatePost(Long postId) {

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional == null || postOptional.isEmpty()) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();
        List<PostImage> postImageList = post.getPostImageList();
        List<Map.Entry<Long, String>> imgList = new ArrayList<>();
        for (PostImage postImage : postImageList) {
            imgList.add(new AbstractMap.SimpleEntry<>(postImage.getId(), postImage.getImgUrl()));
        }
        PostUpdateResponseDto postUpdateResponseDto = PostUpdateResponseDto.builder()
                .postId(postId)
                .imgPathList(imgList)
                .type(post.getPostType())
                .Content(post.getContent())
                .build();

        return postUpdateResponseDto;
    }

    @Override
    public List<PostSearchResponseDto> searchPost(PostSearchRequestDto requestDto, Pageable pageable) {

        String cafeName;
        List<Post> postList;
        // 1. 유저 기본사항을 체크한다. OK
        CheckedResponseDto checked = postUtil.checkMember();
        Long memberId = checked.getMemberId();

        // 2. request Dto 값들 체크 - OK
        Long postId = requestDto.getPostId();
        int searchType = requestDto.getSearchType();
        Double latitude = requestDto.getLatitude();
        Double longitude = requestDto.getLongitude();
        Double dist = requestDto.getDist();
        String searchKeyword = requestDto.getSearchKey();

        // 3. 주변 카페들 정보 알아오기 - 주변 카페에 해당되는 글들만 된다.
        ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
        List<NearByCafeResultDto> nearByCafeResultDtos = cafeService.getNearByCafeLocations(clientPosInfoDto);

        if (nearByCafeResultDtos.isEmpty() || nearByCafeResultDtos == null) {
            throw new PostException(PostExceptionType.NO_CAFE_AROUND);
        } else {
            System.out.println(" 글 불러오기 - 주변 카페 개수 : " + nearByCafeResultDtos.size() + "개       " + nearByCafeResultDtos);
        }
        // cafe id 만 전달해줄거임
        List<Long> cafeIdList = new ArrayList<>();
        for (NearByCafeResultDto dto : nearByCafeResultDtos) {
            cafeIdList.add(dto.getId().longValue());
        }

        if (searchType == 1) { // 글 내용으로 찾기

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("글내용으로 찾기 첫번째 요청");
                postList = postRepository.findBySearchContentFirst(cafeIdList, searchKeyword, pageable);

            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("글내용으로 찾기 다음 요청");
                postList = postRepository.findBySearchContentNext(cafeIdList, searchKeyword, postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else if (searchType == 2) { // 유저 이름으로 찾기

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("유저 이름으로 찾기 첫번째 요청");
                postList = postRepository.findBySearchNicknameFirst(cafeIdList,searchKeyword, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("유저 이름으로 찾기 다음 요청");
                postList = postRepository.findBySearchNicknameNext(cafeIdList,searchKeyword,postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else {
            throw new PostException(PostExceptionType.NOT_ALLOWED_TYPE);
        }
//         post를 slice 형태로 갖고오기

        if (postList.isEmpty() || postList == null) { // 불러올 게시물이 있을때
            throw new PostException(PostExceptionType.NO_POST_FEED);
        }

        // 5. 리턴값 채워넣기
        List<PostSearchResponseDto> responseDtoList = new ArrayList<>();
        for (Post slice : postList) {
            Optional<Post> optionalPost = postRepository.findById(slice.getId());
            Post post = optionalPost.get();
            List<PostImage> postImages = imageRepository.findAllByPostId(postId);

            List<String> imgUrlPath = new ArrayList<>();
            for (PostImage postImage : postImages) {
                imgUrlPath.add(postImage.getImgUrl());
            }
            int postLikeCount = post.getPostLikeList().size();
            int commentCount = post.getCommentList().size();


            PostSearchResponseDto postSearchResponseDto = PostSearchResponseDto.builder()
                    .isCafeAuthorized(post.isCafeAuthorized())
                    .postId(slice.getId())
                    .imgUrlPath(imgUrlPath)
                    .createdAt(post.getCreatedAt())
                    .searchType(searchType)
                    .content(post.getContent())
                    .commentCount(commentCount)
                    .writerNickname(post.getMember().getNickname())
                    .postLikeCount(postLikeCount)
                    .build();

            if (post.isCafeAuthorized()) {
                if (post.getPostCafeList() == null || post.getPostCafeList().isEmpty()) {
                    throw new PostException(PostExceptionType.NO_POST_CAFE);
                }
                // 당연히 없지
                PostCafe postCafe = post.getPostCafeList().get(0); // 인증된 유저의 글쓰기 경우, postCafe 객체를 하나만 가지고있음
                Cafe cafe = postCafe.getCafe();
                Long cafeId = cafe.getId();
                String brandType = cafe.getBrandType();
                cafeName = cafe.getName();
                Long exp = memberCafeTierRepository.findByMemberIdAndCafeId(post.getMember().getId(), cafeId).get().getExp();
                postSearchResponseDto.updateDto(cafeName, exp, brandType);
            }
            responseDtoList.add(postSearchResponseDto);
        }
        return responseDtoList;

    }

    /**
     * 7. 글 업데이트 하기 [ 테스트 완료 ]
     **/
    @Override
    public boolean updatePostForm(MultipartFile[] files, PostUpdateFormRequestDto updateDto) {

        // 1. 글 업데이트
        Long postId = updateDto.getPostId();
        String content = updateDto.getContent();
        List<Long> imageIdList = updateDto.getImageIdList();

        if (imageIdList != null ||imageIdList.isEmpty() ||  content != null || files != null) {

        } else {
            throw new PostException(NO_CONTENT_POST_FORM);
        }

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional == null || postOptional.isEmpty()) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();
        if (content != null || !content.isEmpty()) {
            post.updateContent(content);

        }
        System.out.println(files);

        // 2. 이미지 업데이트
        postUtil.imageDelete(post, imageIdList);
        if (files != null) {
            List<PostImage> postImages = postUtil.imageUpload(post, files);
            post.updatePostImage(postImages);
        }
        postRepository.save(post);
        return true;
    }
}
