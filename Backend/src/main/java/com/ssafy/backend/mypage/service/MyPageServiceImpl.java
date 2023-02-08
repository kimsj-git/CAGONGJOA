package com.ssafy.backend.mypage.service;

import com.ssafy.backend.cafe.domain.dto.CafeNameAndBrandDto;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.mypage.domain.dto.CafeLiveRespDto;
import com.ssafy.backend.mypage.domain.dto.GetTimeReqDto;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.domain.entity.Todo;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import com.ssafy.backend.todaycafe.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional
public class MyPageServiceImpl implements MyPageService{

    private final CafeVisitLogRepository cafeVisitLogRepository;
    private final MemberService memberService;
    private final TodoRepository todoRepository;
    private final FortuneRepository fortuneRepository;

    @Override
    public List<CafeLiveRespDto> getCafeLives(int todayDate) {

        List<CafeLiveRespDto> cafeLiveRespDtoList = new ArrayList<>();

        int ymDate = todayDate / 100;

        long memberId = memberService.getMemberIdAndNicknameByJwtToken().getId();

        // 운세 포함 특정 회원의 특정 년월에서의 카페 visit 내역 리스트
//        List<CafeVisitLog> cafeVisitLogsWithFortunes = cafeVisitLogRepository.findCafeVisitLogsWithFortune(memberId, ymDate);

        List<CafeVisitLog> cafeVisitLogsWithFortunes
                = cafeVisitLogRepository.findByVisitedAtLikeAndMemberId(memberId, Integer.toString(ymDate));

        for (CafeVisitLog cafeVisitLogsWithFortune : cafeVisitLogsWithFortunes) {
            Long cafeVisLogId = cafeVisitLogsWithFortune.getId();
            List<Todo> todos = todoRepository.findTodoByIdCafeVisitId(cafeVisLogId);

            int todoCount = todos.size();
            int clearCount = 0;

            for (Todo todo : todos) {
                if (todo.isComplete()) {
                    clearCount++;
                }
            }

            int dateInt = cafeVisitLogsWithFortune.getVisitedAt();
            int accTime = cafeVisitLogsWithFortune.getAccTime(); // 누적 시간

            int todoAchievementRate;

            if (todoCount == 0) {
                todoAchievementRate = 0;
            } else {
                todoAchievementRate = (clearCount / todoCount) * 100; // 달성도
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
}
