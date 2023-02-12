package com.ssafy.backend.member.repository;

import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.domain.entity.MemberCoin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberCafeTierRepository extends JpaRepository<MemberCafeTier, Long> {
    Optional<MemberCafeTier> findByMemberIdAndCafeId(Long memberId, Long cafeId);

    @Query("select mc from MemberCafeTier mc left join mc.cafe c where mc.member.id = :memberId order by mc.exp desc, c.brandType")
    List<MemberCafeTier> findAllCafeTier(@Param("memberId") Long memberId);
}
