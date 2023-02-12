package com.ssafy.backend.mypage.service;

import com.ssafy.backend.cafe.domain.dto.CafeNameAndBrandDto;
import com.ssafy.backend.common.exception.mypage.MyPageException;
import com.ssafy.backend.common.exception.mypage.MyPageExceptionType;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.VisitCafeListResponseDto;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.domain.entity.Todo;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import com.ssafy.backend.todaycafe.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
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
    private final MemberCafeTierRepository memberCafeTierRepository;

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

    /** 방문한 카페 목록 던져주기  **/
    @Override
    public List<VisitCafeListResponseDto> getCafeVisitList() {
        Long memberId = postUtil.checkMember().getMemberId();
        List<VisitCafeListResponseDto> visitCafeResponseList = new ArrayList<>();
        List<MemberCafeTier> memberCafeTierList = memberCafeTierRepository.findAllCafeTier(memberId);
        if(memberCafeTierList.isEmpty() || memberCafeTierList == null) {
            throw new MyPageException(MyPageExceptionType.NO_CAFE_VISITED);
        }
        for (MemberCafeTier memberCafe : memberCafeTierList) {
            VisitCafeListResponseDto responseDto = VisitCafeListResponseDto.builder()
                    .cafeId(memberCafe.getCafe().getId())
                    .exp(memberCafe.getExp())
                    .brandType(memberCafe.getCafe().getBrandType())
                    .cafeName(memberCafe.getCafe().getName())
                    .build();

            visitCafeResponseList.add(responseDto);
        }

        return visitCafeResponseList;
    }
}
