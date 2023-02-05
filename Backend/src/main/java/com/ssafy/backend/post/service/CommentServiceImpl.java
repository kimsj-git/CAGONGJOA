package com.ssafy.backend.post.service;


import com.ssafy.backend.jwt.JwtUtil;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.repository.MemberRepository;
import com.ssafy.backend.post.domain.dto.*;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.CommentLike;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.repository.*;
import com.ssafy.backend.post.util.PostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.*;

@RequiredArgsConstructor
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private Slice<Comment> comments;
    private final JwtUtil jwtUtil;
    private final PostUtil postUtil;
    private Slice<Post> postSlice;
    private Post post;
    private Member member;
    private Comment comment;

    /**
     * 2-1. 댓글 불러오기
     **/
    @Override
    public List<CommentPagingResponseDto> feedComment(CommentPagingRequestDto requestDto, Pageable pageable) throws Exception {
        // 가지고와야할 값 - 댓글, 대댓글 / 작성시간 /
        postUtil.checkMember();

        List<CommentPagingResponseDto> commentResponseList = new ArrayList<>();
        CommentPagingResponseDto commentPagingResponseDto;
        Long commentId = requestDto.getCommentId();
        Long postId = requestDto.getPostId();

        if(commentId == -1) {
            comments = commentRepository.findAllByPostId(postId);
        }else {
            comments = commentRepository.findAllByIdLessThanAndPostId(commentId, postId);
        }

        for (Comment comment : comments) {
            commentPagingResponseDto = CommentPagingResponseDto.CommentResponseBuilder()
                    .memberId(comment.getMember().getId())
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .commentLike(comment.getCommentLikeList().size())
                    .build();

            commentResponseList.add(commentPagingResponseDto);
        }

        return commentResponseList;
    }

    /**
     * 2-2. 댓글 쓰기 [테스트 완료 - step_no 랑 group_no 알고리즘만 경희랑 이야기해서 짜면될듯]
     **/
    @Override
    public void writeComment(CommentWriteRequestDTO commentWriteDto) throws Exception {
        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        // 2. 값 확인
        Long commentMemberId = commentWriteDto.getMemberId();
        Long postId = commentWriteDto.getPostId();
        String content = commentWriteDto.getContent();
        Long group = commentWriteDto.getGroup();
        Long step = commentWriteDto.getStep();

        // 3. 값 찾아오기
        Optional<Member> memberOptional = memberRepository.findById(commentMemberId);
        member = memberOptional.orElseThrow();

        Optional<Post> postOptional = postRepository.findById(postId);
        post = postOptional.orElseThrow();

        // 4. 글 저장하기
        comment = Comment.CommentWriteBuilder()
                .group(group)
                .member(member)
                .post(post)
                .content(content)
                .step(step)
                .build();

        System.out.println(comment);
        // 인증 여부에 따라 글을 쓸수있다 - GeoAuth
        commentRepository.save(comment);
    }

    /**
     * 2-2. 댓글 업데이트
     **/

    @Override
    public void updateComment(CommentUpdateRequestDTO commentUpdateDto) throws Exception{
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        Long commentId = commentUpdateDto.getCommentId();
        String content = commentUpdateDto.getContent();

        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if(optionalComment == null || optionalComment.isEmpty()) {
            return;
        }else {
            Comment comment = optionalComment.orElseThrow();
            comment.updateComment(content);
        }

        commentRepository.save(comment);
    }

    /**
     * 3. 댓글 좋아요
     **/
    @Override
    public Map.Entry<Boolean, Long> likeComment(Long commentId, Boolean isChecked) throws Exception {
        Boolean responseIsChecked;

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        // False 라면 생성

        if (!isChecked) {
            CommentLike commentLike = CommentLike.CommentLikeBuilder()
                    .comment(comment)
                    .member(member)
                    .build();
            commentLikeRepository.save(commentLike);
            responseIsChecked = true;
        }
        // True 라면 삭제
        else {
            commentLikeRepository.deleteByCommentIdAndMemberId(commentId, memberId);
            responseIsChecked = false;
        }
        Long count = commentLikeRepository.countCommentLikeByCommentId(commentId);

        return new AbstractMap.SimpleEntry<>(responseIsChecked, count);
    }

    /**
     * 4. 댓글 삭제 - 삭제되면 대댓글도 같이삭제?
     **/

    @Override
    public boolean deleteComment(Long commentId) throws Exception{

        //1. 유저를 확인한다.
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        //2. 유저(나) 와 댓글유저가 일치하는지 확인한다.

        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        long commentMemberId = commentOptional.orElseThrow().getMember().getId();

        if(memberId == commentMemberId) { // 글쓴이와 유저가 일치한다면 삭제
            commentRepository.deleteById(commentId);
            return true;
        } else { // 유저가 일치하지 않는다면 badgateway
            return false;
        }

    }
}
