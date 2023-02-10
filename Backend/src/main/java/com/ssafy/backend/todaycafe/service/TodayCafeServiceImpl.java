package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.cafe.domain.dto.AfterCafeAuthResponseDto;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberCoinRepository;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import com.ssafy.backend.todaycafe.domain.dto.*;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.Survey;
import com.ssafy.backend.todaycafe.domain.entity.Todo;
import com.ssafy.backend.todaycafe.repository.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import com.ssafy.backend.todaycafe.repository.SurveyRepository;
import com.ssafy.backend.todaycafe.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequiredArgsConstructor
@Service
@Transactional
public class TodayCafeServiceImpl implements TodayCafeService {

    private final PostUtil postUtil;
    private final SurveyRepository surveyRepository;
    private final MemberCoinRepository memberCoinRepository;
    private final CafeVisitLogRepository cafeVisitLogRepository;
    private final FortuneRepository fortuneRepository;
    private final MemberRepository memberRepository;
    private final CafeRepository cafeRepository;
    private final TodoRepository todoRepository;
    private CoffeeMakeResponseDto coffeeResponseDto;
    private FortuneResponseDto fortuneResponseDto;
    private Long memberId;
    private MemberCoin memberCoin;
    private int coffeeCnt;
    private int coffeeBeanCnt;
    private Long fortuneId;
    private Map.Entry<Long, String> fortune;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final CafeAuthRepository cafeAuthRepository;


    // 1. 커피 갖고오기
    public CoffeeMakeResponseDto getCoffees() throws Exception {
        memberId = postUtil.checkMember().getMemberId();

        Optional<MemberCoin> memberCoinOptional = memberCoinRepository.findByMemberId(memberId);

        if (memberCoinOptional == null || memberCoinOptional.isEmpty()) {
            coffeeResponseDto = CoffeeMakeResponseDto.builder()
                    .responseType(1)
                    .build();
            return coffeeResponseDto; // 방금 만들어졌으니깐 쓸수있을리가 없지
        }
        memberCoin = memberCoinOptional.get();
        coffeeCnt = memberCoin.getCoffeeCount();
        coffeeBeanCnt = memberCoin.getCoffeeBeanCount();
        coffeeResponseDto = CoffeeMakeResponseDto.builder()
                .coffeeBeanCnt(coffeeBeanCnt)
                .coffeeCnt(coffeeCnt)
                .build();
        System.out.println("커피 가져왔어여");
        return coffeeResponseDto;
    }

    // 2. 운세 랜덤으로 뽑기
    public Map.Entry<Long, String> getFortune() {
        int fortuneSize = fortuneRepository.findAll().size();
        double randomInt = fortuneSize * Math.random();
        fortuneId = (long) (Math.ceil(randomInt)); // 0이 나오지 않게하기 위해 올림 처리
        System.out.println("fortuneSize : " + fortuneSize + ", fortuneId : " + fortuneId);
        Optional<Fortune> optionalFortune = fortuneRepository.findById(fortuneId);
        Fortune fortune = optionalFortune.get();
        System.out.println("운세 만들어졌어요");
        return new AbstractMap.SimpleEntry<>(fortuneId, fortune.getContent());
    }

    /**
     * 1. 커피 내리기
     **/
    @Override
    public CoffeeMakeResponseDto makeCoffee(int type) throws Exception {
        coffeeResponseDto = getCoffees();
        coffeeCnt = coffeeResponseDto.getCoffeeCnt();
        coffeeBeanCnt = coffeeResponseDto.getCoffeeBeanCnt();

        if (type == 1) { // 1번을 했을때
            if (coffeeBeanCnt >= 10) {
                coffeeCnt += 1;
                coffeeBeanCnt -= 10;

                memberCoin.updateCoin(coffeeBeanCnt, coffeeCnt);
                coffeeResponseDto.setResponseType(2);
                return coffeeResponseDto;
            } else { // 10 보다 작을때

                coffeeResponseDto.setResponseType(3);
                return coffeeResponseDto;
            }
        } else if (type == 2) { // 2번을 했을 때
            if (coffeeBeanCnt >= 27) {
                coffeeCnt += 3;
                coffeeBeanCnt -= 27;

                memberCoin.updateCoin(coffeeBeanCnt, coffeeCnt);
                coffeeResponseDto.setResponseType(4);
                return coffeeResponseDto;
            } else {
                coffeeResponseDto.setResponseType(5);
                return coffeeResponseDto;
            }

        } else {
            coffeeResponseDto.setResponseType(6);
            return coffeeResponseDto;
        }
    }

    /**
     * 2. 오늘의운세 주기
     **/

    @Override
    public FortuneResponseDto randomFortune(int type) throws Exception {
        CafeVisitLog cafeVisitLog;
        coffeeResponseDto = getCoffees();
        coffeeCnt = coffeeResponseDto.getCoffeeCnt();
        coffeeBeanCnt = coffeeResponseDto.getCoffeeBeanCnt();
        String nickname = postUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId(); // CafeAuth 를 거쳐왔기 때문에 null일 수 없음
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId);
        if (optionalCafeVisitLog.isEmpty() || optionalCafeVisitLog == null) {
            fortuneResponseDto.setResponseType(1);
            return fortuneResponseDto; // cafeVisitLog 가 없음
        }

        cafeVisitLog = optionalCafeVisitLog.get();

        if (type == 1) { // 1뽑 - 재화없이 뽑기

            fortune = getFortune();
            fortuneResponseDto = FortuneResponseDto.builder()
                    .content(fortune.getValue())
                    .responseType(2)
                    .build();

            cafeVisitLog.updateFortune(fortune.getKey());
            return fortuneResponseDto;

        } else if (type == 2) { // 커피 하나로 뽑기
            if (coffeeCnt >= 1) { // coffee 가 있으면
                cafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId).get();

                fortune = getFortune();

                while (fortune.getKey() == cafeVisitLog.getFortuneId()) {
                    fortune = getFortune();
                    System.out.println("todayserviceImpl : " + fortune.getKey());
                }
                fortuneResponseDto = FortuneResponseDto.builder()
                        .content(getFortune().getValue())
                        .responseType(3)
                        .build();
                memberCoin.useOneCoffee();
                cafeVisitLog.updateFortune(fortune.getKey());
                return fortuneResponseDto;

            } else { // coffee 가 없으면
                fortuneResponseDto.setResponseType(4);
                return fortuneResponseDto;
            }

        } else {
            fortuneResponseDto.setResponseType(5);
            return fortuneResponseDto;
        }
    }

    /**
     * 3. 카페를 방문할 시 visitLog 생성
     **/
    @Override
    public AfterCafeAuthResponseDto saveCafeVisit() throws Exception {
        CafeVisitLog cafeVisitLog;
        // 1. 필요 값들 불러오기
        memberId = postUtil.checkMember().getMemberId();
        String nickname = postUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId();
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        System.out.println("TodayCafeServiceImpl : " + visitedAtValue);
        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId);
        // 2. cafeVisitLog 생성
        // 2-1. 이전 방문이력이 없을 때
        if (optionalCafeVisitLog.isEmpty() || optionalCafeVisitLog == null) {
            cafeVisitLog = CafeVisitLog.builder()
                    .cafe(cafeRepository.findById(cafeId).get())
                    .member(memberRepository.findById(memberId).get())
                    .accTime(0)
                    .fortuneId(0L)
                    .isSurvey(false)
                    .visitedAt(visitedAtValue)
                    .build();
            System.out.println(cafeVisitLog);
            cafeVisitLogRepository.save(cafeVisitLog);
            System.out.println("방문이력 없음 - 새로생성");
        } else {// 기존 방문이력이 있음
            cafeVisitLog = optionalCafeVisitLog.get();
            // 2-2. 오늘 방문이력이 있을 때
            if (cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId).isPresent())
                System.out.println("오늘 방문이력 있음 - 미생성");
                // 2-3. 방문이력이 있지만 오늘은 아닐 때
            else {
                cafeVisitLog = CafeVisitLog.builder()
                        .cafe(cafeRepository.findById(cafeId).get())
                        .member(memberRepository.findById(memberId).get())
                        .build();
                cafeVisitLogRepository.save(cafeVisitLog);
                memberCafeTierRepository.findByMemberIdAndCafeId(memberId, cafeId).get().plusExp(100L);
                System.out.println("오늘은 아니고 방문이력 있음 - 새로생성");
            }
        }

        // 3. responseDto 채우기
        memberCoin = memberCoinRepository.findByMemberId(memberId).get();
        MemberCafeTier tier = memberCafeTierRepository.findByMemberIdAndCafeId(memberId, cafeId).get();
        AfterCafeAuthResponseDto cafeAuthResponseDto = AfterCafeAuthResponseDto.builder()
                .cafeName(cafeRepository.findById(cafeId).get().getName())
                .exp(tier.getExp())
                .brandType(cafeVisitLog.getCafe().getBrandType())
                .accTime(cafeVisitLog.getAccTime())
                .coffeeBeanCnt(memberCoin.getCoffeeBeanCount())
                .coffeeCnt(memberCoin.getCoffeeCount())
                .build();

        System.out.println("여기까지옴 4트");
        Optional<Fortune> fortuneOptional = fortuneRepository.findById(cafeVisitLog.getFortuneId());
        if (fortuneOptional.isPresent()) {
            String fortuneContent = fortuneOptional.get().getContent();
            cafeAuthResponseDto.updateFortune(fortuneContent);
        }
        System.out.println("여기까지옴 5트");
        return cafeAuthResponseDto;
    }

    @Override
    public int saveSurvey(SurveyRequestDto surveyRequestDto) throws Exception {

        String replyWifi = surveyRequestDto.getReplyWifi();
        String replyPower = surveyRequestDto.getReplyPower();
        String replyToilet = surveyRequestDto.getReplyToilet();
        boolean replyTime = surveyRequestDto.isReplyTime();
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        memberId = postUtil.checkMember().getMemberId();
        String nickname = postUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Cafe cafe = cafeRepository.findById(cafeAuth.getCafeId()).get();

        CafeVisitLog cafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafe.getId()).get();
        if (cafeVisitLog.isSurvey()) {
            return 1;
        }

        Survey survey = Survey.builder()
                .cafe(cafe)
                .member(memberRepository.findById(memberId).get())
                .replyWifi(replyWifi)
                .replyPower(replyPower)
                .replyToilet(replyToilet)
                .replyTime(replyTime)
                .createdAt(LocalDateTime.now())
                .build();
        if (survey == null) {
            return 2;
        }
        survey = surveyRepository.save(survey);
        System.out.println(survey);


        cafeVisitLog.updateIsSurvey();
        return 3;
    }

    @Override
    public int todoEvent(TodoReqeustDto todoReqeustDto) throws Exception {
        CafeVisitLog cafeVisitLog;
        int eventType = todoReqeustDto.getEventType();
        Long todoId = todoReqeustDto.getTodoId();
        String content = todoReqeustDto.getContent();
        int visitedAt = todoReqeustDto.getVisitedAt();
        Boolean isComplete = todoReqeustDto.isComplete();

        memberId = postUtil.checkMember().getMemberId();
        String nickname = postUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId();

        if (eventType == 1 || eventType == 2 || eventType == 3 || eventType == 4) {

        }else {
            return 0;
        }

        if (visitedAt == 0) {
            return 1; // visited at은 0이면 안됨
        }
        if (eventType == 1) { // Todo 생성
            cafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAt, memberId, cafeId).get();
            Todo todo = Todo.builder()
                    .cafeVisitLog(cafeVisitLog)
                    .build();
            if (content == null) {
                return 2;
            }
            todo.updateContent(content);
            todoRepository.save(todo);
            return 3;
        }

        if (todoId == null) {
            return 4; // todoId 가 필요함 작업임
        }
        Optional<Todo> todoOptional = todoRepository.findById(todoId);
        if (todoOptional.isEmpty() || todoOptional == null) {
            return 5; // 잘못된 todo Id
        }
        Todo todo = todoOptional.get();

        if (eventType == 2) { // Todo 업데이트 - todo 의 pk 로
            if (content == null || content.isEmpty()) {
                return 6; // content 가 널이면 안됨
            }
            todo.updateContent(content);
            todoRepository.save(todo);
        }
        if (eventType == 3) { // Todo 토글 -
            if (isComplete != todo.isComplete()) {
                return 7;
            }
                todo.checkToggle();
            return 8; // 토글완료
        }
        if (eventType == 4) { // Todo 삭제 - todo 의 pk 로
            todoRepository.deleteById(todoId);
            return 9; // 삭제 완료
        }

        return 99;
    }

    @Override
    public List<TodoResponseDto> findTodo(int visitedAt) throws Exception {
        memberId = postUtil.checkMember().getMemberId();

        List<CafeVisitLog> cafeVisitLogList = cafeVisitLogRepository.findByVisitedAtAndMemberId(visitedAt, memberId);
        if(cafeVisitLogList.isEmpty() || cafeVisitLogList == null) {
            return null; // 불러올 todo가 없음
        }
        List<TodoResponseDto> todoResponseDtoList = new ArrayList<>();
        for (CafeVisitLog cafeVisitLog :cafeVisitLogList) {
            List<Todo> todoList = cafeVisitLog.getTodoList();
            for (Todo todo:todoList) {

                todoResponseDtoList.add(new TodoResponseDto(todo.getId(),todo.getContent(),todo.isComplete()));
            }
        }

        return todoResponseDtoList;
    }
}