package com.ssafy.backend.post.service;


import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.util.MemberUtil;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.CommentLike;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.PostUtil;
import com.ssafy.backend.redis.CafeAuth;
import com.ssafy.backend.redis.CafeAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@RequiredArgsConstructor
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final PostRepository postRepository;
    private final CafeRepository cafeRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private final PostUtil postUtil;
    private final MemberUtil memberUtil;
    private final CafeAuthRepository cafeAuthRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;

    /**
     * 2-1. 댓글 불러오기
     **/
    @Override
    public List<CommentPagingResponseDto> feedComment(CommentPagingRequestDto requestDto) {
        // 가지고와야할 값 - 댓글, 대댓글 / 작성시간 /
        memberUtil.checkMember();

        List<CommentPagingResponseDto> commentResponseList = new ArrayList<>();
        Long commentId = requestDto.getCommentId();
        Long postId = requestDto.getPostId();
        Long groupNo;
        if (commentId == -1L) {
            groupNo = 1L;
        } else {
            groupNo = commentRepository.findById(commentId).get().getGroupNo();
        }

        // 2.
        Set<Long> groupSet = new HashSet<>();
        List<Comment> commentList = commentRepository.findAllByPostId(postId);
        if (commentList == null || commentList.isEmpty()) {
//            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
            return null;
        }
        for (Comment comment : commentList) {
            if (comment.getGroupNo() > groupNo) groupSet.add(comment.getGroupNo());
            if (groupSet.size() == 5) break;
        }
        System.out.println(groupSet);
        if (groupSet.isEmpty() || groupSet == null) { // 불러올 그게 없다.
//            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
            return null;
        }
        Slice<Comment> commentSlice = commentRepository.findAllByGroupNoInAndPostId(groupSet, postId);
        if (commentSlice == null || commentSlice.isEmpty()) {
//            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
            return null;
        }
        Map<Long, String> commentNicknameMap = new TreeMap<>();


        for (Comment comment : commentSlice) {
            commentNicknameMap.put(comment.getId(), comment.getMember().getNickname());
        }

        for (Comment comment : commentSlice) {
            CommentPagingResponseDto commentPagingResponseDto = CommentPagingResponseDto.CommentResponseBuilder()
                    .commentId(comment.getId())
                    .writerId(comment.getMember().getId())
                    .writerNickname(comment.getMember().getNickname())
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .commentLikeCnt(comment.getCommentLikeList().size())
                    .groupNo(comment.getGroupNo())
                    .stepNo(comment.getStepNo())
                    .build();
            System.out.println("미인증 유저 댓글쓰기 불러오기 완료");
            Optional<CafeAuth> cafeAuth = cafeAuthRepository.findById(comment.getMember().getNickname());
            if (cafeAuth.isPresent()) {
                Cafe cafe = cafeRepository.findById(cafeAuth.get().getCafeId()).get();
                MemberCafeTier memberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(comment.getMember().getId(), cafe.getId()).get();
                commentPagingResponseDto.updateCommentVerifiedUser(cafe.getId(), cafe.getName(), memberCafeTier.getExp(), cafe.getBrandType());
                System.out.println("인증유저 댓글 업데이트 완료");
            }
            commentResponseList.add(commentPagingResponseDto);
        }
        return commentResponseList;
    }

    /**
     * 2-2. 댓글 쓰기 [테스트 완료]
     **/
    @Override
    public Long writeComment(CommentWriteRequestDTO commentWriteDto) {
        //1. 유저 확인
        CheckedResponseDto checked = memberUtil.checkMember();
        Long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        // 2. 값 확인
        Long commentId = commentWriteDto.getCommentId();
        Long postId = commentWriteDto.getPostId();
        String content = commentWriteDto.getContent();
        Member member = memberRepository.findById(memberId).get();

        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty() || postOptional == null) {
            throw new PostException(PostExceptionType.BAD_POST_ID);
        }
        Post post = postOptional.get();

        // 3. 댓글 대댓글 구분
        Long groupNo;
        Long stepNo;
        Optional<Comment> commentOptional = commentRepository.findTopByPostIdOrderByIdDesc(postId);
        if (commentId == -1L) { // 댓글
            if (commentOptional.isEmpty() || commentOptional == null) {
                groupNo = 1L;
                stepNo = 0L;
            } else {
                groupNo = commentOptional.get().getGroupNo() + 1L;
                stepNo = 0L;
            }
        } else {
            groupNo = commentRepository.findById(commentId).get().getGroupNo();
            stepNo = commentRepository.findTopByPostIdAndGroupNoOrderByIdDesc(postId, groupNo).get().getStepNo() + 1;
        }

        // 4. 글 저장하기
        Comment comment = Comment.builder()
                .groupNo(groupNo)
                .member(member)
                .post(post)
                .content(content)
                .stepNo(stepNo)
                .build();

        // 인증 여부에 따라 글을 쓸수있다 - GeoAuth - 따로 필요없음
        comment = commentRepository.save(comment);
        // 댓글을 썼을 때 어떻게 해야하징...
        return comment.getId();
    }

    /**
     * 2-3. 댓글 업데이트
     **/

    @Override
    public void updateComment(CommentUpdateRequestDTO commentUpdateDto) {
        CheckedResponseDto checked = memberUtil.checkMember();
        Long commentId = commentUpdateDto.getCommentId();

        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        Comment comment;
        if (optionalComment == null || optionalComment.isEmpty()) {
            throw new PostException(PostExceptionType.BAD_COMMENT_ID);

        } else {
            comment = optionalComment.get();
        }

        Long writerId = comment.getMember().getId();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        if (writerId != memberId) {
            // 글쓴이와 수정하려는 사람이 같지 않으면
            throw new PostException(PostExceptionType.USER_IS_NOT_WRITER);
        }
        String content = commentUpdateDto.getContent();
        if (content == null || content.isEmpty()) {
            // content 가 비어있어!
            throw new PostException(PostExceptionType.NO_CONTENT_COMMENT_FORM);
        }
        comment.updateComment(content);
        commentRepository.save(comment);
    }

    /**
     * 3. 댓글 좋아요
     **/
    @Override
    public CommentLikeResponseDto likeComment(CommentLikeRequestDto requestDto) {
        Boolean responseIsChecked;

        //1. 유저 확인
        CheckedResponseDto checked = memberUtil.checkMember();
        Long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        Boolean isChecked = requestDto.getIsChecked();
        Long commentId = requestDto.getCommentId();

        System.out.println("isChecked : " + isChecked + "    memberId : " + memberId);

        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isEmpty() || optionalComment == null) {
            throw new PostException(PostExceptionType.BAD_COMMENT_ID);
        }
        Comment comment = optionalComment.get();
        Optional<CommentLike> commentLikeOptional = commentLikeRepository.findByCommentIdAndMemberId(commentId, memberId);

        if (!isChecked) {
            if (commentLikeOptional.isPresent()) {
                throw new PostException(PostExceptionType.COMMENT_LIKE_CHECK_FAIL);
            } else {
                CommentLike commentLike = CommentLike.CommentLikeBuilder()
                        .comment(comment)
                        .member(memberRepository.findById(memberId).get())
                        .build();
                commentLikeRepository.save(commentLike);
                responseIsChecked = true;
            }
        }
        // True 라면 삭제
        else {
            if (commentLikeOptional.isEmpty()) {
                throw new PostException(PostExceptionType.COMMENT_LIKE_CHECK_FAIL);
            } else {
                commentLikeRepository.deleteByCommentIdAndMemberId(commentId, memberId);
                responseIsChecked = false;
            }
        }
        int count = commentLikeRepository.countCommentLikeByCommentId(commentId);

        CommentLikeResponseDto commentLikeResponseDto = CommentLikeResponseDto.builder()
                .commentId(commentId)
                .likeCount(count)
                .isChecked(responseIsChecked)
                .build();
        return commentLikeResponseDto;
    }


    /**
     * 4. 댓글 삭제 - 삭제되면 대댓글도 같이삭제?
     **/

    @Override
    public void deleteComment(Long commentId) {
        //1. 유저를 확인한다.
        CheckedResponseDto checked = memberUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        //2. 유저(나) 와 댓글유저가 일치하는지 확인한다.
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty() || commentOptional == null) {
            throw new PostException(PostExceptionType.BAD_COMMENT_ID);
        }
        Comment comment = commentOptional.get();
        long commentMemberId = comment.getMember().getId();

        if (memberId == commentMemberId) { // 글쓴이와 유저가 일치한다면 삭제, 대댓글도 다 삭제
            commentRepository.deleteAllByGroupNo(comment.getGroupNo());
        } else { // 유저가 일치하지 않는다면 badgateway
            throw new PostException(PostExceptionType.USER_IS_NOT_WRITER);
        }

    }
}
