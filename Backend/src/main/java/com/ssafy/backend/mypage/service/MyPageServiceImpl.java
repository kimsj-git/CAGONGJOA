package com.ssafy.backend.mypage.service;

import com.ssafy.backend.cafe.domain.dto.CafeNameAndBrandDto;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.domain.entity.CafeLocation;
import com.ssafy.backend.cafe.repository.CafeLocationRepository;
import com.ssafy.backend.common.exception.mypage.MyPageException;
import com.ssafy.backend.common.exception.mypage.MyPageExceptionType;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.MyCommentResponseDto;
import com.ssafy.backend.mypage.domain.dto.MyFeedResponseDto;
import com.ssafy.backend.mypage.domain.dto.VisitCafeListResponseDto;
import com.ssafy.backend.post.domain.dto.CheckedResponseDto;
import com.ssafy.backend.post.domain.dto.PostSearchResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostCafe;
import com.ssafy.backend.post.domain.entity.PostImage;
import com.ssafy.backend.post.repository.PostImageRepository;
import com.ssafy.backend.post.repository.PostRepository;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.domain.entity.Todo;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import com.ssafy.backend.todaycafe.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional
public class MyPageServiceImpl implements MyPageService {

    private final CafeVisitLogRepository cafeVisitLogRepository;
    private final MemberService memberService;
    private final TodoRepository todoRepository;
    private final FortuneRepository fortuneRepository;
    private final PostUtil postUtil;
    private final PostRepository postRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final PostImageRepository postImageRepository;
    private final CafeLocationRepository cafeLocationRepository;

    @Override
    public List<CafeLiveRespDto> getCafeLives(int todayDate) {

        List<CafeLiveRespDto> cafeLiveRespDtoList = new ArrayList<>();

        int ymDate = todayDate / 100;

        long memberId = memberService.getMemberIdAndNicknameByJwtToken().getId();

        List<CafeVisitLog> cafeVisitLogsWithFortunes
                = cafeVisitLogRepository.findByVisitedAtLikeAndMemberId(memberId, Integer.toString(ymDate));

        for (CafeVisitLog cafeVisitLogsWithFortune : cafeVisitLogsWithFortunes) {
            Long cafeVisLogId = cafeVisitLogsWithFortune.getId();
            List<Todo> todos = todoRepository.findAllByCafeVisitLogId(cafeVisLogId);

            int todoCount = todos.size();
            int clearCount = 0;

            for (Todo todo : todos) {
                if (todo.isComplete()) {
                    clearCount++;
                }
            }

            int dateInt = cafeVisitLogsWithFortune.getVisitedAt();
            int accTime = cafeVisitLogsWithFortune.getAccTime(); // 누적 시간

            double todoAchievementRate;

            if (todoCount == 0) {
                todoAchievementRate = 0;
            } else {
                todoAchievementRate = (clearCount * 1.0 / todoCount) * 100; // 달성도
                BigDecimal bd = new BigDecimal(todoAchievementRate);
                bd = bd.setScale(2, RoundingMode.HALF_UP);
                todoAchievementRate = bd.doubleValue();
            }

            Optional<Fortune> optFortune = fortuneRepository.findById(cafeVisitLogsWithFortune.getFortuneId());

            String fortuneMsg = "";

            if (optFortune.isPresent()) {
                fortuneMsg = optFortune.get().getContent();
            }

            CafeNameAndBrandDto cafeInfo = CafeNameAndBrandDto.builder()
                    .name(cafeVisitLogsWithFortune.getCafe().getName())
                    .brandType(cafeVisitLogsWithFortune.getCafe().getBrandType())
                    .build();


            CafeLiveRespDto cafeLiveRespDto = CafeLiveRespDto.builder()
                    .visitedAt(dateInt)
                    .accTime(accTime)
                    .todoAchievementRate(todoAchievementRate)
                    .cafeInfo(cafeInfo)
                    .fortuneMsg(fortuneMsg)
                    .build();

            cafeLiveRespDtoList.add(cafeLiveRespDto);
        }

        return cafeLiveRespDtoList;
    }

    /**
     * 2. 방문한 카페 목록 주기
     **/
    @Override
    public List<VisitCafeListResponseDto> getCafeVisitList() {
        Long memberId = postUtil.checkMember().getMemberId();
        List<VisitCafeListResponseDto> visitCafeResponseList = new ArrayList<>();
        List<MemberCafeTier> memberCafeTierList = memberCafeTierRepository.findAllCafeTier(memberId);
        if (memberCafeTierList.isEmpty() || memberCafeTierList == null) {
            throw new MyPageException(MyPageExceptionType.NO_CAFE_VISITED);
        }
        List<Long> cafeIdList = new ArrayList<>();
        for (MemberCafeTier memberCafe : memberCafeTierList) {
            cafeIdList.add(memberCafe.getCafe().getId());
        }

        List<CafeLocation> cafeLocationList = cafeLocationRepository.findAllByIdIn(cafeIdList);

        MemberCafeTier memberCafeTier;
        CafeLocation cafeLocation;
        for (int i = 0; i < memberCafeTierList.size(); i++) {
            memberCafeTier = memberCafeTierList.get(i);
            cafeLocation = cafeLocationList.get(i);
            VisitCafeListResponseDto responseDto = VisitCafeListResponseDto.builder()
                    .cafeId(memberCafeTier.getCafe().getId())
                    .exp(memberCafeTier.getExp())
                    .brandType(memberCafeTier.getCafe().getBrandType())
                    .cafeName(memberCafeTier.getCafe().getName())
                    .latitude(cafeLocation.getLat())
                    .longitude(cafeLocation.getLng())
                    .address(cafeLocation.getAddress())
                    .build();

            visitCafeResponseList.add(responseDto);
        }

        return visitCafeResponseList;
    }

    @Override
    public List<MyFeedResponseDto> getMyFeed(Long postId, Pageable pageable) {
        String cafeName;
        List<Post> postList;
        // 1. 유저 기본사항을 체크한다. OK
        CheckedResponseDto checked = postUtil.checkMember();
        Long memberId = checked.getMemberId();


        if (postId == -1L) {
            // 처음 요청할때 (refresh)
            System.out.println("글내용으로 찾기 첫번째 요청");
            postList = postRepository.findAllMyFeed(Long.MAX_VALUE,memberId, pageable);

        } else {
            // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
            System.out.println("글내용으로 찾기 다음 요청");
            postList = postRepository.findAllMyFeed(postId,memberId, pageable);
            // 갖고올 게시물이 없으면
        }
//         post를 slice 형태로 갖고오기

        if (postList.isEmpty() || postList == null) { // 불러올 게시물이 없을 때
            throw new PostException(PostExceptionType.NO_POST_FEED);
        }

        // 5. 리턴값 채워넣기
        List<MyFeedResponseDto> responseDtoList = new ArrayList<>();
        for (Post slice : postList) {
            Optional<Post> optionalPost = postRepository.findById(slice.getId());
            Post post = optionalPost.get();
            List<PostImage> postImages = postImageRepository.findAllByPostId(postId);

            List<String> imgUrlPath = new ArrayList<>();
            for (PostImage postImage : postImages) {
                imgUrlPath.add(postImage.getImgUrl());
            }
            int postLikeCount = post.getPostLikeList().size();
            int commentCount = post.getCommentList().size();

            MyFeedResponseDto myFeedResponseDto = MyFeedResponseDto.builder()
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
                myFeedResponseDto.updateDto(cafeName, exp, brandType);
            }
            responseDtoList.add(myFeedResponseDto);
        }
        return responseDtoList;
    }

    @Override
    public List<MyCommentResponseDto> getMyComment(Long commentId, Pageable pageable) {
        return null;
    }
}
