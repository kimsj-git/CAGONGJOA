package com.ssafy.backend.post.service;


import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.member.util.MemberUtil;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.CommentLike;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.DtoMakingUtil;
import com.ssafy.backend.post.util.PagingUtil;
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
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private final PagingUtil pagingUtil;
    private final MemberUtil memberUtil;
    private final DtoMakingUtil dtoMakingUtil;

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
            groupNo = 0L;
        } else {
            groupNo = commentRepository.findById(commentId).get().getGroupNo();
        }

        // 2.
        Set<Long> groupSet = new HashSet<>();
        List<Comment> commentList = commentRepository.findAllByPostId(postId);
        if (commentList == null || commentList.isEmpty()) {
            return commentResponseList;
        }
        for (Comment comment : commentList) {
            if (comment.getGroupNo() > groupNo) groupSet.add(comment.getGroupNo());
            if (groupSet.size() == 10) break;
        }
        System.out.println(groupSet);
        if (groupSet.isEmpty() || groupSet == null) { // 불러올 그게 없다.
//            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
            return commentResponseList;
        }
        List<List<Comment>> commentGroupListList = new ArrayList<>();
        for (Long groupId : groupSet) {
            List<Comment> commentGroupList = commentRepository.findAllByPostIdAndGroupNoOrderById(postId, groupId);
            commentGroupListList.add(commentGroupList);
        }
        Slice<Comment> commentSlice = commentRepository.findAllByGroupNoInAndPostId(groupSet, postId);
        if (commentSlice == null || commentSlice.isEmpty()) {
//            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
            return commentResponseList;
        }
        CommentPagingResponseDto commentPagingResponseDto;
        for (List<Comment> comments : commentGroupListList) {
            commentPagingResponseDto = dtoMakingUtil.getCommentList(comments);
            commentResponseList.add(commentPagingResponseDto);
        }

        return commentResponseList;
    }

    /**
     * 2-2. 댓글 쓰기 [테스트 완료]
     **/
    @Override
    public CommentPagingResponseDto writeComment(CommentWriteRequestDTO commentWriteDto) {
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

        Map.Entry<Long, Long> groupNoResult = pagingUtil.findGroupNo(postId, commentId);
        Long groupNo = groupNoResult.getKey();
        Long stepNo = groupNoResult.getValue();

        // 4. 글 저장하기
        Comment comment = Comment.builder()
                .member(member)
                .post(post)
                .content(content)
                .groupNo(groupNo)
                .stepNo(stepNo)
                .build();

        // 인증 여부에 따라 글을 쓸수있다 - GeoAuth - 따로 필요없음
        Comment savedComment = commentRepository.save(comment);

        if (stepNo != 0) { // 대댓글일 때
            System.out.println("대댓글!");
        } else { // 그렇지 않을때 -> Redirect
            System.out.println("댓글!");
            return null;
        }
        // 댓글을 썼을 때 어떻게 해야하징...
        List<Comment> commentGroupList = commentRepository.findAllByPostIdAndGroupNoOrderById(postId, groupNo);
        if (commentGroupList.isEmpty() || commentGroupList == null) {
            throw new PostException(PostExceptionType.NO_COMMENT_FEED);
        }

        return dtoMakingUtil.getCommentList(commentGroupList);
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
        Long postId = comment.getPost().getId();
        Long groupNo = comment.getGroupNo();
        long commentMemberId = comment.getMember().getId();

        if (memberId == commentMemberId) { // 글쓴이와 유저가 일치한다면 삭제, 대댓글도 다 삭제
            if (comment.getStepNo() == 0) {
                commentRepository.deleteAllByPostIdAndGroupNo(postId, groupNo);
            } else {
                commentRepository.deleteById(comment.getId());
            }
        } else { // 유저가 일치하지 않는다면 badgateway
            throw new PostException(PostExceptionType.USER_IS_NOT_WRITER);
        }

    }
}
