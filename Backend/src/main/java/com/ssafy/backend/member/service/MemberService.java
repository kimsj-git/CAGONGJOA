package com.ssafy.backend.member.service;

import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.enums.OauthType;

import java.util.Map;
import java.util.Optional;

public interface MemberService {
    void checkDuplicatedNickname(String nickName);

    void changeNickname(Member member, String newNickname);

    // 메소드 오버로딩으로 구현할것
    Optional<Member> getMember(long kakaoMemberId, OauthType kakao);

    void saveMember(long oAuthId, String nickname, OauthType oauthType);

    Map<String, Object> tokenRefresh();

    void logout();

    MemberIdAndNicknameDto getMemberIdAndNicknameByJwtToken();

    void deleteMember();

}
