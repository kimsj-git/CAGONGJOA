package com.ssafy.backend.post.util;


import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.post.domain.dto.CommentPagingResponseDto;
import com.ssafy.backend.post.domain.dto.RepliesPagingResponseDto;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.CommentLikeRepository;
import com.ssafy.backend.post.repository.CommentRepository;
import com.ssafy.backend.post.repository.PostRepository;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RequiredArgsConstructor // 얘도 커스텀?
@Transactional(readOnly = true)
@Service
public class DtoMakingUtil {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    private final CafeAuthRepository cafeAuthRepository;
    private final CafeRepository cafeRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;
    private final CommentLikeRepository commentLikeRepository;


    public CommentPagingResponseDto getCommentList(List<Comment> commentGroupList) {
        CommentPagingResponseDto commentPagingResponseDto = CommentPagingResponseDto.CommentResponseBuilder()
                .commentId(commentGroupList.get(0).getId())
                .writerId(commentGroupList.get(0).getMember().getId())
                .writerNickname(commentGroupList.get(0).getMember().getNickname())
                .content(commentGroupList.get(0).getContent())
                .createdAt(commentGroupList.get(0).getCreatedAt())
                .commentLikeCnt(0)
                .likeChecked(false)
                .groupNo(commentGroupList.get(0).getGroupNo())
                .writerType(false)
                .build();

        if(commentGroupList.get(0).getCommentLikeList() != null) {
            commentPagingResponseDto.updateCommentLike(commentGroupList.get(0).getCommentLikeList().size());
        }

        Optional<CafeAuth> cafeAuthOptional = cafeAuthRepository.findById(commentGroupList.get(0).getMember().getNickname());
        if (cafeAuthOptional.isPresent()) {
            Long cafeId = cafeAuthOptional.get().getCafeId();
            Cafe cafe = cafeRepository.findById(cafeId).get();
            MemberCafeTier memberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(commentGroupList.get(0).getMember().getId(), cafeId).get();
            commentPagingResponseDto.updateCommentVerifiedUser(cafeId, cafe.getName(), memberCafeTier.getExp(), cafe.getBrandType());
        }

        if(commentLikeRepository.findByCommentIdAndMemberId(commentGroupList.get(0).getId(),commentGroupList.get(0).getMember().getId()).isPresent()) {
            commentPagingResponseDto.updateLikeChecked(true);
        }

        List<RepliesPagingResponseDto> repliesList = new ArrayList<>();

        Long parentId = commentGroupList.get(0).getId();
        for (Comment commentSlice : commentGroupList) {
            if (commentSlice.getStepNo() == 0) {

            } else {

                RepliesPagingResponseDto repliesPagingResponseDto = RepliesPagingResponseDto.RepliesResponseBuilder()
                        .commentId(commentSlice.getId())
                        .writerId(commentSlice.getMember().getId())
                        .writerNickname(commentSlice.getMember().getNickname())
                        .content(commentSlice.getContent())
                        .createdAt(commentSlice.getCreatedAt())
                        .parentId(parentId)
                        .commentLikeCnt(0)
                        .likeChecked(false)
                        .writerType(false)
                        .build();

                if(commentSlice.getCommentLikeList() != null) {
                    repliesPagingResponseDto.updateCommentLike(commentSlice.getCommentLikeList().size());
                }

                Optional<CafeAuth> cafeOptional = cafeAuthRepository.findById(commentSlice.getMember().getNickname());
                if (cafeOptional.isPresent()) {
                    Long cafeId = cafeOptional.get().getCafeId();
                    Cafe cafe = cafeRepository.findById(cafeId).get();
                    MemberCafeTier memberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(commentSlice.getMember().getId(), cafeId).get();
                    repliesPagingResponseDto.updateCommentVerifiedUser(cafeId, cafe.getName(), memberCafeTier.getExp(), cafe.getBrandType());
                }

                if (repliesPagingResponseDto != null) {
                    repliesList.add(repliesPagingResponseDto);
                }
                if(commentLikeRepository.findByCommentIdAndMemberId(commentSlice.getId(),commentSlice.getMember().getId()).isPresent()) {
                    commentPagingResponseDto.updateLikeChecked(true);
                }
            }

        }

            commentPagingResponseDto.updateReplies(repliesList);
        return commentPagingResponseDto;
    }

}
