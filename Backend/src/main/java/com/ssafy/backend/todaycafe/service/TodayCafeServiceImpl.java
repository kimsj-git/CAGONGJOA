package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.cafe.domain.dto.AfterCafeAuthResponseDto;
import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.domain.entity.CafeCrowd;
import com.ssafy.backend.cafe.repository.CafeCrowdRepository;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.common.exception.cafe.CafeException;
import com.ssafy.backend.common.exception.cafe.CafeExceptionType;
import com.ssafy.backend.common.exception.member.MemberException;
import com.ssafy.backend.common.exception.member.MemberExceptionType;
import com.ssafy.backend.common.exception.todaycafe.TodayCafeException;
import com.ssafy.backend.common.exception.todaycafe.TodayCafeExceptionType;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberCoinRepository;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.member.util.MemberUtil;
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
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final CafeAuthRepository cafeAuthRepository;
    private final CafeCrowdRepository cafeCrowdRepository;
    private final MemberUtil memberUtil;
    private final MemberService memberService;


    // 1. 커피 갖고오기
    public CoffeeMakeResponseDto getCoffees() {
        // 1. id 받아오기s
        CoffeeMakeResponseDto coffeeResponseDto;
        Long memberId = memberUtil.checkMember().getMemberId();
        Optional<MemberCoin> memberCoinOptional = memberCoinRepository.findByMemberId(memberId);

        if (memberCoinOptional == null || memberCoinOptional.isEmpty()) {
            throw new TodayCafeException(TodayCafeExceptionType.BAD_MEMBER_ID);
        }

        MemberCoin memberCoin = memberCoinOptional.get();
        int coffeeCnt = memberCoin.getCoffeeCount();
        int coffeeBeanCnt = memberCoin.getCoffeeBeanCount();
        coffeeResponseDto = CoffeeMakeResponseDto.builder()
                .coffeeBeanCnt(coffeeBeanCnt)
                .coffeeCnt(coffeeCnt)
                .build();
        System.out.println("커피 가져왔어여");
        return coffeeResponseDto;
    }

    /**
     * 2. 오늘의운세 주기
     **/

    @Override
    public FortuneResponseDto getFortune() {
        // 오늘의 카페에 등록된 운세 메세지가 있는지 확인
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        long memberId = memberService.getMemberIdAndNicknameByJwtToken().getId();
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        Long cafeId = cafeAuthRepository.findById(nickname).get().getCafeId(); // @CafeAuth 를 거쳐왔기 때문에 null일 수 없음

        CafeVisitLog cafeVisitLog = cafeVisitLogRepository
                .findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId)
                .orElseThrow(() -> new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG)); // 204 -> 잘못된 요청

        MemberCoin memberCoin = memberCoinRepository
                .findByMemberId(memberId).orElseThrow(() -> new MemberException(MemberExceptionType.MEMBER_DB_ERR));
        int coffeeCount = memberCoin.getCoffeeCount();

        // 현재 뽑은 운세 id로 운세 내용 가져오기
        long todayFortuneId = cafeVisitLog.getFortuneId();
        String fortuneContent = "";

        // 운세 내용 넣어주기
        if (todayFortuneId != 0) {
            fortuneContent = fortuneRepository.findById(todayFortuneId).get().getContent();
        }

        FortuneResponseDto fortuneResponseDto = FortuneResponseDto.builder()
                .content(fortuneContent)
                .coffeeCnt(coffeeCount)
                .build();

        return fortuneResponseDto;
    }

    /**
     * 2.2 운세 뽑기
     * @return
     */
    @Override
    public FortuneResponseDto pickFortune() {
        /**
         * 오늘의 카페에 등록된 운세 메세지가 있는지 확인한다
         * -> 등록된 운세 메세지가 없다면 처음뽑기니까 return 200 ok
         *
         * -> 등록된 운세 메세지가 있다면, 다시 뽑기니까 커피 갯수 확인
         * 만약 커피 갯수가 한개 이상이라면 -> 커피갯수 차감하고 운세 제공 -> 200 ok
         * 만약 커피 갯수가 한개 미만이라면 -> 커피 갯수 부족 리턴 (406)
         */

        // 오늘의 카페에 등록된 운세 메세지가 있는지 확인
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        long memberId = memberService.getMemberIdAndNicknameByJwtToken().getId();
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        Long cafeId = cafeAuthRepository.findById(nickname).get().getCafeId(); // @CafeAuth 를 거쳐왔기 때문에 null일 수 없음

        CafeVisitLog cafeVisitLog = cafeVisitLogRepository
                .findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId)
                .orElseThrow(() -> new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG)); // 204 -> 잘못된 요청

        MemberCoin memberCoin = memberCoinRepository
                .findByMemberId(memberId).orElseThrow(() -> new MemberException(MemberExceptionType.MEMBER_DB_ERR));
        int coffeeCount = memberCoin.getCoffeeCount();

        // 운세를 뽑은적이 없다면 무료로 운세 뽑고 리턴
        if (cafeVisitLog.getFortuneId() == 0) {
            Map.Entry<Long, String> randomFortune = getRandomFortune();
            FortuneResponseDto fortuneResponseDto = FortuneResponseDto.builder()
                    .content(randomFortune.getValue())
                    .coffeeCnt(coffeeCount)
                    .build();
            cafeVisitLog.updateFortune(randomFortune.getKey());
            return fortuneResponseDto;
        }

        // 운세 뽑은적이 있다면, 코인 차감하고 리턴
        //// 근데 만약 재화가 부족하다면 에러 리턴
        if (coffeeCount < 1) {
            throw new TodayCafeException(TodayCafeExceptionType.NO_COFFEE); // 406
        }

        //// 재화가 부족하지 않다면 재화를 차감하고 운세 리턴
        Map.Entry<Long, String> randomFortune = getRandomFortune();
        while (randomFortune.getKey() == cafeVisitLog.getFortuneId()) {
            randomFortune = getRandomFortune();
        }

        FortuneResponseDto fortuneResponseDto = FortuneResponseDto.builder()
                .content(getRandomFortune().getValue())
                .build();

        memberCoin.useOneCoffee();
        cafeVisitLog.updateFortune(randomFortune.getKey());

        return fortuneResponseDto;
    }

    // 2. 운세 랜덤으로 뽑기
    public Map.Entry<Long, String> getRandomFortune() {
        int fortuneSize = fortuneRepository.findAll().size();
        double randomInt = fortuneSize * Math.random();
        Long fortuneId = (long) (Math.ceil(randomInt)); // 0이 나오지 않게하기 위해 올림 처리
        Optional<Fortune> optionalFortune = fortuneRepository.findById(fortuneId);
        Fortune fortune = optionalFortune.get();
        return new AbstractMap.SimpleEntry<>(fortuneId, fortune.getContent());
    }

    /**
     * 1. 커피 내리기
     **/
    @Override
    public CoffeeMakeResponseDto makeCoffee(int type) {
        Long memberId = memberUtil.checkMember().getMemberId();
        CoffeeMakeResponseDto coffeeResponseDto = getCoffees();
        int coffeeCnt = coffeeResponseDto.getCoffeeCnt();
        int coffeeBeanCnt = coffeeResponseDto.getCoffeeBeanCnt();

        Optional<MemberCoin> memberCoinOptional = memberCoinRepository.findByMemberId(memberId);

        if (memberCoinOptional == null || memberCoinOptional.isEmpty()) {
            throw new TodayCafeException(TodayCafeExceptionType.BAD_MEMBER_ID);
        }
        MemberCoin memberCoin = memberCoinOptional.get();
        if (type == 1) { // 1번을 했을때
            if (coffeeBeanCnt >= 10) {
                coffeeCnt += 1;
                coffeeBeanCnt -= 10;

                memberCoin.updateCoin(coffeeBeanCnt, coffeeCnt);

                // 변경된 내용으로 리턴하기 위해 dto 내용 업데이트
                coffeeResponseDto.setCoffeeCnt(coffeeCnt);
                coffeeResponseDto.setCoffeeBeanCnt(coffeeBeanCnt);

                return coffeeResponseDto;
            } else { // 10 보다 작을때
                throw new TodayCafeException(TodayCafeExceptionType.NOT_ENOUGH_10_BEAN);
            }
        } else if (type == 2) { // 2번을 했을 때
            if (coffeeBeanCnt >= 27) {
                coffeeCnt += 3;
                coffeeBeanCnt -= 27;

                memberCoin.updateCoin(coffeeBeanCnt, coffeeCnt);

                // 변경된 내용으로 리턴하기 위해 dto 내용 업데이트
                coffeeResponseDto.setCoffeeCnt(coffeeCnt);
                coffeeResponseDto.setCoffeeBeanCnt(coffeeBeanCnt);
                return coffeeResponseDto;
            } else {
                throw new TodayCafeException(TodayCafeExceptionType.NOT_ENOUGH_27_BEAN);
            }

        } else {
            throw new TodayCafeException(TodayCafeExceptionType.BAD_TYPE_REQUEST);
        }
    }


//    @Override
//    public FortuneResponseDto randomFortune(int type) {
//
//        CoffeeMakeResponseDto coffeeResponseDto = getCoffees();
//        Long memberId = memberUtil.checkMember().getMemberId();
//        int coffeeCnt = coffeeResponseDto.getCoffeeCnt();
//        String nickname = memberUtil.checkMember().getNickname();
//        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
//        Long cafeId = cafeAuth.getCafeId(); // CafeAuth 를 거쳐왔기 때문에 null일 수 없음
//        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
//
//        Optional<MemberCoin> memberCoinOptional = memberCoinRepository.findByMemberId(memberId);
//
//        if (memberCoinOptional == null || memberCoinOptional.isEmpty()) {
//            throw new TodayCafeException(TodayCafeExceptionType.BAD_MEMBER_ID);
//        }
//        MemberCoin memberCoin = memberCoinOptional.get();
//
//        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId);
//        if (optionalCafeVisitLog.isEmpty() || optionalCafeVisitLog == null) {
//            throw new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG);
//        }
//        Map.Entry<Long, String> fortune;
//        CafeVisitLog cafeVisitLog = optionalCafeVisitLog.get();
//        FortuneResponseDto fortuneResponseDto;
//        if (type == 1) { // 1뽑 - 재화없이 뽑기
//            fortune = getRandomFortune();
//            fortuneResponseDto = FortuneResponseDto.builder()
//                    .content(fortune.getValue())
//                    .coffeeCnt(coffeeCnt)
//                    .build();
//
//            cafeVisitLog.updateFortune(fortune.getKey());
//            return fortuneResponseDto;
//
//        } else if (type == 2) { // 커피 하나로 뽑기
//            if (coffeeCnt >= 1) { // coffee 가 있으면
//
//                fortune = getRandomFortune();
//
//                while (fortune.getKey() == cafeVisitLog.getFortuneId()) {
//                    fortune = getRandomFortune();
//                    System.out.println("todayserviceImpl : " + fortune.getKey());
//                }
//                fortuneResponseDto = FortuneResponseDto.builder()
//                        .content(getRandomFortune().getValue())
//                        .build();
//
//                memberCoin.useOneCoffee();
//                cafeVisitLog.updateFortune(fortune.getKey());
//
//                return fortuneResponseDto;
//
//            } else { // coffee 가 없으면
//                throw new TodayCafeException(TodayCafeExceptionType.NO_COFFEE);
//            }
//
//        } else {
//            throw new TodayCafeException(TodayCafeExceptionType.BAD_TYPE_REQUEST);
//        }
//    }

    /**
     * 3. 카페를 방문할 시 visitLog 생성
     **/
    @Override
    public AfterCafeAuthResponseDto saveCafeVisit() {
        CafeVisitLog cafeVisitLog;
        // 1. 필요 값들 불러오기
        Long memberId = memberUtil.checkMember().getMemberId();
        String nickname = memberUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId();
        System.out.println("CAFEAuth 가 있나요?" + cafeAuth);
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        System.out.println("TodayCafeServiceImpl : " + visitedAtValue);
        Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId);
        // 2. cafeVisitLog 생성
        // 2-1. 이전 방문이력이 없을 때
        CafeVisitLog savedCafeVisitLog;
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
            savedCafeVisitLog = cafeVisitLogRepository.save(cafeVisitLog);
            System.out.println("방문이력 없음 - 새로생성");
        } else {// 기존 방문이력이 있음
            savedCafeVisitLog = optionalCafeVisitLog.get();
            // 2-2. 오늘 방문이력이 있을 때
            if (cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId).isPresent())
                System.out.println("오늘 방문이력 있음 - 미생성");
                // 2-3. 방문이력이 있지만 오늘은 아닐 때
            else {
                cafeVisitLog = CafeVisitLog.builder()
                        .cafe(cafeRepository.findById(cafeId).get())
                        .member(memberRepository.findById(memberId).get())
                        .accTime(0)
                        .fortuneId(0L)
                        .isSurvey(false)
                        .visitedAt(visitedAtValue)
                        .build();
                savedCafeVisitLog = cafeVisitLogRepository.save(cafeVisitLog);
                memberCafeTierRepository.findByMemberIdAndCafeId(memberId, cafeId).get().plusExp(100L);
                System.out.println("오늘은 아니고 방문이력 있음 - 새로생성");
            }
        }

        // 3. responseDto 채우기
        MemberCoin memberCoin = memberCoinRepository.findByMemberId(memberId).get();
        MemberCafeTier tier = memberCafeTierRepository.findByMemberIdAndCafeId(memberId, cafeId).get();
        AfterCafeAuthResponseDto cafeAuthResponseDto = AfterCafeAuthResponseDto.builder()
                .cafeName(cafeRepository.findById(cafeId).get().getName())
                .exp(tier.getExp())
                .brandType(savedCafeVisitLog.getCafe().getBrandType())
                .accTime(savedCafeVisitLog.getAccTime())
                .isCrowdSubmitted(savedCafeVisitLog.isCrowdSurvey())
                .isSurveySubmitted(savedCafeVisitLog.isSurvey())
                .coffeeBeanCnt(memberCoin.getCoffeeBeanCount())
                .coffeeCnt(memberCoin.getCoffeeCount())
                .build();

        Optional<Fortune> fortuneOptional = fortuneRepository.findById(savedCafeVisitLog.getFortuneId());
        if (fortuneOptional.isPresent()) {
            String fortuneContent = fortuneOptional.get().getContent();
            cafeAuthResponseDto.updateFortune(fortuneContent);
        }

        System.out.println("카페생성 성공!");
        return cafeAuthResponseDto;
    }

    /**
     * 4. 조사결과 저장
     **/
    @Override
    public void saveSurvey(SurveyRequestDto surveyRequestDto) {

        String replyWifi = surveyRequestDto.getReplyWifi();
        String replyPower = surveyRequestDto.getReplyPower();
        String replyToilet = surveyRequestDto.getReplyToilet();
        boolean replyTime = surveyRequestDto.isReplyTime();
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        Long memberId = memberUtil.checkMember().getMemberId();
        String nickname = memberUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Cafe cafe = cafeRepository.findById(cafeAuth.getCafeId()).get();

        CafeVisitLog cafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafe.getId()).get();
        if (cafeVisitLog.isSurvey()) {
            throw new TodayCafeException(TodayCafeExceptionType.SURVEY_ALREADY_SUBMITTED);
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

        surveyRepository.save(survey);
        cafeVisitLog.updateIsSurvey();
    }

    /**
     * 5. Todo Event
     **/
    @Override
    public TodoResponseDto todoEvent(TodoReqeustDto todoReqeustDto) {
        CafeVisitLog cafeVisitLog;
        TodoResponseDto todoResponseDto;
        int eventType = todoReqeustDto.getEventType();
        Long todoId = todoReqeustDto.getTodoId();
        String content = todoReqeustDto.getContent();
        int visitedAt = todoReqeustDto.getVisitedAt();
        Boolean isComplete = todoReqeustDto.getIsComplete();

        Long memberId = memberUtil.checkMember().getMemberId();
        String nickname = memberUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId();

        // 1: create, 2: update, 3: toggle, 4: delete
        if (eventType == 1 || eventType == 2 || eventType == 3 || eventType == 4) {

        } else {
            throw new TodayCafeException(TodayCafeExceptionType.BAD_TYPE_REQUEST);
        }

        if (visitedAt == 0) {
            throw new TodayCafeException(TodayCafeExceptionType.VISITED_AT_ERROR);
        }

        // Type 1
        if (eventType == 1) { // Todo 생성
            cafeVisitLog = cafeVisitLogRepository
                    .findByVisitedAtAndMemberIdAndCafeId(visitedAt, memberId, cafeId)
                    .orElseThrow(() -> new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG));

            Todo todo = Todo.builder()
                    .cafeVisitLog(cafeVisitLog)
                    .build();

            if (content == null) {
                throw new TodayCafeException(TodayCafeExceptionType.NO_CONTENT);
            }

            todo.updateContent(content); // 글 내용 생성

            Todo savedTodo = todoRepository.save(todo);

            todoResponseDto = TodoResponseDto.builder()
                    .id(savedTodo.getId())
                    .responseType(1)
                    .isComplete(savedTodo.isComplete())
                    .content(savedTodo.getContent())
                    .build();

            return todoResponseDto;
        }


        if (todoId == null) {
            throw new TodayCafeException(TodayCafeExceptionType.ID_REQUIRED);
        }
        Optional<Todo> todoOptional = todoRepository.findById(todoId);
        if (todoOptional.isEmpty() || todoOptional == null) {
            throw new TodayCafeException(TodayCafeExceptionType.BAD_ID);
        }
        Todo todo = todoOptional.get();

        todoResponseDto = TodoResponseDto.builder()
                .id(todo.getId())
                .isComplete(todo.isComplete())
                .build();
        // Type 2
        if (eventType == 2) { // Todo 업데이트 - todo 의 pk 로
            if (content == null || content.isEmpty()) {
                throw new TodayCafeException(TodayCafeExceptionType.NO_CONTENT);
            }
            todo.updateContent(content);
            todoResponseDto.updateDto(todo.getContent(), todo.isComplete());
            todoResponseDto.updateResponseType(2);
            return todoResponseDto;
        }
        if (eventType == 3) { // Todo 토글 -
            if (isComplete != todo.isComplete()) {
                throw new TodayCafeException(TodayCafeExceptionType.CHECKED_NOT_CORRESPOND);
            }
            todo.checkToggle();
            todoResponseDto.updateDto(todo.getContent(), todo.isComplete());
            todoResponseDto.updateResponseType(3);
            return todoResponseDto;
        }
        if (eventType == 4) { // Todo 삭제 - todo 의 pk 로
            todoRepository.deleteById(todoId);
            todoResponseDto.updateResponseType(4);
            return todoResponseDto;
        } else throw new TodayCafeException(TodayCafeExceptionType.UNKNOWN_ERROR);
    }

    /**
     * 6. Todo 불러오기
     **/
    @Override
    public List<TodoResponseDto> findTodo(int visitedAt) {
        Long memberId = memberUtil.checkMember().getMemberId();

        List<CafeVisitLog> cafeVisitLogList = cafeVisitLogRepository.findAllByVisitedAtAndMemberId(visitedAt, memberId);
        if (cafeVisitLogList.isEmpty() || cafeVisitLogList == null) {
            System.out.println("todoList 불러오기 - visitLog 없음!");
            return null;
        }
        System.out.println("cafeVisitLogList : " + cafeVisitLogList);

        List<TodoResponseDto> todoResponseDtoList = new ArrayList<>();

        for (CafeVisitLog cafeVisitLog : cafeVisitLogList) {
            List<Todo> todoList = todoRepository.findAllByCafeVisitLogId(cafeVisitLog.getId());
            if(todoList == null || todoList.isEmpty()) continue;
            System.out.println("cafeVisitLogId : " + cafeVisitLog.getId());
            for (Todo todo : todoList) {
                todoResponseDtoList.add(TodoResponseDto.builder()
                        .id(todo.getId())
                        .responseType(0)
                        .content(todo.getContent())
                        .isComplete(todo.isComplete())
                        .build());
            }
        }

        return todoResponseDtoList;
    }

    @Override
    public int addTimeBar() {
        Long memberId = memberUtil.checkMember().getMemberId();
        String nickname = memberUtil.checkMember().getNickname();
        CafeAuth cafeAuth = cafeAuthRepository.findById(nickname).get();
        Long cafeId = cafeAuth.getCafeId(); // CafeAuth 를 거쳐왔기 때문에 null일 수 없음
        int visitedAtValue = Integer.parseInt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        CafeVisitLog cafeVisitLog = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(visitedAtValue, memberId, cafeId).get();

        cafeVisitLog.updateTimeBar();
        return cafeVisitLog.getAccTime();
    }

    @Override
    public int getAccTime(int todayDate) {
        MemberIdAndNicknameDto memberIdAndNicknameByJwtToken = memberService.getMemberIdAndNicknameByJwtToken();
        String nickname = memberIdAndNicknameByJwtToken.getNickname();
        long memberId = memberIdAndNicknameByJwtToken.getId();
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname);

        CafeAuth cafeAuth = cafeAuthOptional.orElseThrow(() -> new CafeException(CafeExceptionType.CAFE_AUTH_EXPIRED));

        Optional<CafeVisitLog> cafeVisitLogOptional
                = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(todayDate, memberId, cafeAuth.getCafeId());

        CafeVisitLog cafeVisitLog = cafeVisitLogOptional.
                orElseThrow(() -> new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG));

        return cafeVisitLog.getAccTime();
    }

    @Override
    public Boolean checkSubmitSurvey(int todayDate) {
        // 멤버 id와 cafe 가져오기
        long memberId = memberService.getMemberIdAndNicknameByJwtToken().getId();
        String nickname = memberService.getMemberIdAndNicknameByJwtToken().getNickname();
        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(nickname);
        CafeAuth cafeAuth = cafeAuthOptional.orElseThrow(() -> new CafeException(CafeExceptionType.CAFE_AUTH_EXPIRED));
        Optional<CafeVisitLog> cafeVisitLogOptional
                = cafeVisitLogRepository.findByVisitedAtAndMemberIdAndCafeId(todayDate, memberId, cafeAuth.getCafeId());

        CafeVisitLog cafeVisitLog = cafeVisitLogOptional.
                orElseThrow(() -> new TodayCafeException(TodayCafeExceptionType.NO_VISIT_LOG));

        return cafeVisitLog.isSurvey();
    }


}