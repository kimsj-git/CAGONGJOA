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
import com.ssafy.backend.member.util.MemberUtil;
import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.MyCommentResponseDto;
import com.ssafy.backend.mypage.domain.dto.MyFeedResponseDto;
import com.ssafy.backend.mypage.domain.dto.VisitCafeListResponseDto;
import com.ssafy.backend.post.domain.dto.CheckedResponseDto;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostCafe;
import com.ssafy.backend.post.domain.entity.PostImage;
import com.ssafy.backend.post.repository.CommentRepository;
import com.ssafy.backend.post.repository.PostImageRepository;
import com.ssafy.backend.post.repository.PostRepository;
import com.ssafy.backend.post.util.PagingUtil;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.domain.entity.Todo;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import com.ssafy.backend.todaycafe.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
    private final PagingUtil pagingUtil;
    private final PostRepository postRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final PostImageRepository postImageRepository;
    private final CafeLocationRepository cafeLocationRepository;
    private final MemberUtil memberUtil;
    private final CommentRepository commentRepository;

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
        Long memberId = memberUtil.checkMember().getMemberId();
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
        Slice<Post> postList;
        // 1. 유저 기본사항을 체크한다. OK
        CheckedResponseDto checked = memberUtil.checkMember();
        Long memberId = checked.getMemberId();

        // 2. 내 피드들 가져오기
        Slice<Post> postSlice = pagingUtil.findMyFeeds(postId,memberId,pageable);

        // 5. 리턴값 채워넣기
        List<MyFeedResponseDto> responseDtoList = new ArrayList<>();
        for (Post slice : postSlice) {
            List<PostImage> postImages = postImageRepository.findAllByPostId(slice.getId());

            List<String> imgUrlPath = new ArrayList<>();
            for (PostImage postImage : postImages) {
                imgUrlPath.add(postImage.getImgUrl());
            }
            int postLikeCount = slice.getPostLikeList().size();
            int commentCount = slice.getCommentList().size();

            MyFeedResponseDto myFeedResponseDto = MyFeedResponseDto.builder()
                    .isCafeAuthorized(slice.getIsCafeAuthorized())
                    .postId(slice.getId())
                    .imgUrlPath(imgUrlPath)
                    .createdAt(slice.getCreatedAt())
                    .content(slice.getContent())
                    .commentCount(commentCount)
                    .writerNickname(slice.getMember().getNickname())
                    .postLikeCount(postLikeCount)
                    .postType(slice.getPostType())
                    .build();

            if (slice.getIsCafeAuthorized()) {
                if (slice.getPostCafeList() == null || slice.getPostCafeList().isEmpty()) {
                    throw new PostException(PostExceptionType.NO_POST_CAFE);
                }
                // 당연히 없지
                PostCafe postCafe = slice.getPostCafeList().get(0); // 인증된 유저의 글쓰기 경우, postCafe 객체를 하나만 가지고있음
                Cafe cafe = postCafe.getCafe();
                Long cafeId = cafe.getId();
                String brandType = cafe.getBrandType();
                cafeName = cafe.getName();
                Long exp = memberCafeTierRepository.findByMemberIdAndCafeId(slice.getMember().getId(), cafeId).get().getExp();
                myFeedResponseDto.updateDto(cafeName, exp, brandType);
            }
            responseDtoList.add(myFeedResponseDto);
        }
        return responseDtoList;
    }

    @Override
    public List<MyCommentResponseDto> getMyComment(Long commentId, Pageable pageable) {

        Long memberId = memberUtil.checkMember().getMemberId();

        Slice<Comment> commentSlice = pagingUtil.findMyComments(commentId, memberId, pageable);
        if(commentSlice == null || commentSlice.isEmpty()) {

        }
        List<Long> commentIdList = new ArrayList<>();
        for (Comment comment : commentSlice) {
            commentIdList.add(comment.getId());
        }

        Boolean hasNext;
        if(commentSlice.hasNext()) hasNext = true;
        else hasNext = false;
        List<MyCommentResponseDto> commentResponseDtoList = new ArrayList<>();
        List<Post> postList = postRepository.findAllByCommentIdIn(commentIdList);
        if(postList.size() != commentIdList.size()) {
        }
        MyCommentResponseDto commentResponseDto;
        for (int i = 0; i < postList.size(); i++) {
            Comment comment = commentSlice.getContent().get(i);
            commentResponseDto = MyCommentResponseDto.builder()
                    .postId(comment.getPost().getId())
                    .commentId(comment.getId())
                    .commentContent(comment.getContent())
                    .commentLikeCnt(comment.getCommentLikeList().size())
                    .postContent(comment.getPost().getContent())
                    .createdAt(comment.getCreatedAt())
                    .build();
            if(comment.getPost().getIsCafeAuthorized()) {
                commentResponseDto.updateCafeName(comment.getPost().getPostCafeList().get(0).getCafe().getName());
            }

            commentResponseDtoList.add(commentResponseDto);
        }

        return commentResponseDtoList;
    }
}
