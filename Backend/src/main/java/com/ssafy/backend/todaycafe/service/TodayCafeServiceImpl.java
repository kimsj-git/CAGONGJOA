package com.ssafy.backend.todaycafe.service;

import com.ssafy.backend.member.domain.entity.MemberCoin;
import com.ssafy.backend.member.repository.MemberCoinRepository;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.todaycafe.domain.dto.CoffeeMakeResponseDto;
import com.ssafy.backend.todaycafe.domain.dto.FortuneResponseDto;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLog;
import com.ssafy.backend.todaycafe.domain.entity.CafeVisitLogRepository;
import com.ssafy.backend.todaycafe.domain.entity.Fortune;
import com.ssafy.backend.todaycafe.repository.FortuneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional
public class TodayCafeServiceImpl implements TodayCafeService {

    private final PostUtil postUtil;
    private Long memberId;
    private MemberCoin memberCoin;
    private final MemberCoinRepository memberCoinRepository;
    private int coffeeCnt;
    private int coffeeBeanCnt;
    private CafeVisitLog cafeVisitLog;
    private CoffeeMakeResponseDto coffeeResponseDto;
    private FortuneResponseDto fortuneResponseDto;
    private Long fortuneId;
    private String fortuneContent;
    private final FortuneRepository fortuneRepository;
    private final CafeVisitLogRepository cafeVisitLogRepository;

    // 1. 커피 갖고오기
    public CoffeeMakeResponseDto getCoffees() throws Exception{
        memberId = postUtil.checkMember().getMemberId();

        Optional<MemberCoin> memberCoinOptional = memberCoinRepository.findByMemberId(memberId);

        if (memberCoinOptional == null || memberCoinOptional.isEmpty()) {
            coffeeResponseDto = CoffeeMakeResponseDto.builder()
                    .responseType(1)
                    .build();
            return coffeeResponseDto; // 방금 만들어졌으니깐 쓸수있을리가 없지
        }
        memberCoin = memberCoinOptional.orElseThrow();
        coffeeCnt = memberCoin.getCoffeeCount();
        coffeeBeanCnt = memberCoin.getCoffeeBeanCount();
        coffeeResponseDto = CoffeeMakeResponseDto.builder()
                .coffeeBeanCnt(coffeeBeanCnt)
                .coffeeCnt(coffeeCnt)
                .build();
        return coffeeResponseDto;
    }

    public String getFortune() throws  Exception{

        double randomInt = fortuneRepository.findAll().size() * Math.random();
        fortuneId = (long)(Math.ceil(randomInt)); // 0이 나오지 않게하기 위해
        Optional<Fortune> optionalFortune = fortuneRepository.findById(fortuneId);
        if(optionalFortune == null || optionalFortune.isEmpty()) {
            System.out.println("todayCafeServiceImpl : Unknown Error");
            return null;
        }
        return optionalFortune.orElseThrow().getContent();

    }

    // 2. 커피 내리기
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

                coffeeResponseDto = CoffeeMakeResponseDto.builder()
                        .coffeeBeanCnt(coffeeBeanCnt)
                        .coffeeCnt(coffeeCnt)
                        .responseType(2)
                        .build();
                return coffeeResponseDto;
            } else { // 10 보다 작을때
                coffeeResponseDto = CoffeeMakeResponseDto.builder()
                        .coffeeBeanCnt(coffeeBeanCnt)
                        .coffeeCnt(coffeeCnt)
                        .responseType(3)
                        .build();
                return coffeeResponseDto;
            }
        } else if (type == 2) { // 2번을 했을 때
            if (coffeeBeanCnt >= 27) {
                coffeeCnt += 3;
                coffeeBeanCnt -= 27;
                memberCoin.updateCoin(coffeeBeanCnt, coffeeCnt);
                coffeeResponseDto = CoffeeMakeResponseDto.builder()
                        .coffeeBeanCnt(coffeeBeanCnt)
                        .coffeeCnt(coffeeCnt)
                        .responseType(4)
                        .build();
                return coffeeResponseDto;
            } else {
                coffeeResponseDto = CoffeeMakeResponseDto.builder()
                        .coffeeBeanCnt(coffeeBeanCnt)
                        .coffeeCnt(coffeeCnt)
                        .responseType(5)
                        .build();
                return coffeeResponseDto;
            }

        }else {
            coffeeResponseDto = CoffeeMakeResponseDto.builder()
                    .coffeeBeanCnt(coffeeBeanCnt)
                    .coffeeCnt(coffeeCnt)
                    .responseType(6)
                    .build();
            return coffeeResponseDto;
        }
    }

    @Override
    public FortuneResponseDto randomFortune(int type) throws Exception {
        coffeeResponseDto = getCoffees();
        coffeeCnt = coffeeResponseDto.getCoffeeCnt();
        coffeeBeanCnt = coffeeResponseDto.getCoffeeBeanCnt();

            if(type == 1) { // 1연뽑 - 재화없이 뽑기

                fortuneResponseDto = FortuneResponseDto.builder()
                        .content(getFortune())
                        .responseType(1)
                        .build();
                Long cafeId = 1L;

                Optional<CafeVisitLog> optionalCafeVisitLog = cafeVisitLogRepository.findByMemberIdAndCafeId(memberId, cafeId);
                return fortuneResponseDto;

            }else if(type == 2) { // 커피 하나로 뽑기
                if(coffeeCnt >= 1){ // coffee 가 있으면


                    fortuneResponseDto = FortuneResponseDto.builder()
                            .content(getFortune())
                            .responseType(2)
                            .build();
                    return fortuneResponseDto;

                }else { // coffee 가 없으면

                    fortuneResponseDto = FortuneResponseDto.builder()
                            .responseType(3)
                            .build();
                    return fortuneResponseDto;
                }

            }else {
                return fortuneResponseDto;
            }


    }
}
