package com.ssafy.backend.post.service;


import com.ssafy.backend.cafe.domain.entity.Cafe;
import com.ssafy.backend.cafe.repository.CafeRepository;
import com.ssafy.backend.member.domain.entity.Member;
import com.ssafy.backend.member.domain.entity.MemberCafeTier;
import com.ssafy.backend.member.repository.MemberCafeTierRepository;
import com.ssafy.backend.member.repository.MemberRepository;
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
    private final PostLikeRepository postLikeRepository;
    private final CafeRepository cafeRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final MemberRepository memberRepository;
    private Slice<Comment> comments;
    private final PostUtil postUtil;
    private Post post;
    private Member member;
    private final CafeAuthRepository cafeAuthRepository;
    private final MemberCafeTierRepository memberCafeTierRepository;

    /**
     * 2-1. 댓글 불러오기
     **/
    @Override
    public List<CommentPagingResponseDto> feedComment(CommentPagingRequestDto requestDto) throws Exception {
        // 가지고와야할 값 - 댓글, 대댓글 / 작성시간 /
        postUtil.checkMember();

        List<CommentPagingResponseDto> commentResponseList = new ArrayList<>();
        Long commentId = requestDto.getCommentId();
        Long postId = requestDto.getPostId();
        Post post = postRepository.findById(postId).get();
        Long group;
        if(commentId == -1L) {
            group = 0L;
        }
        else{
            group = commentRepository.findById(commentId).get().getGroupNo();
        }

        // 2.
        Set<Long> groupSet = new HashSet<>();
        List<Comment> commentList = post.getCommentList();
        if(commentList == null || commentList.isEmpty()) {
            return null;
        }
        for (Comment comment: commentList) {
            if(comment.getGroupNo() > group) groupSet.add(comment.getGroupNo());
            if(groupSet.size() == 5) break;
        }
        System.out.println(groupSet);
        if(groupSet.isEmpty() || groupSet == null) { // 불러올 그게 없다.
            return null;
        }
        Slice<Comment> commentSlice = commentRepository.findAllByGroupNoInAndPostId(groupSet, postId);
        if(commentSlice == null || commentSlice.isEmpty()) {
            return null;
        }


        for (Comment comment : commentSlice) {
            CommentPagingResponseDto commentPagingResponseDto = CommentPagingResponseDto.CommentResponseBuilder()
                    .writerId(comment.getMember().getId())
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .commentLikeCnt(comment.getCommentLikeList().size())
                    .build();
            commentResponseList.add(commentPagingResponseDto);
            System.out.println("미인증 유저 댓글쓰기 불러오기 완료");
            Optional<CafeAuth> cafeAuth = cafeAuthRepository.findById(comment.getMember().getNickname());
            if(cafeAuth.isPresent()) {
                Cafe cafe = cafeRepository.findById(cafeAuth.get().getCafeId()).get();
                MemberCafeTier memberCafeTier = memberCafeTierRepository.findByMemberIdAndCafeId(comment.getMember().getId(),cafe.getId()).get();
                commentPagingResponseDto.updateCommentVerifiedUser(cafe.getId(),cafe.getName(),memberCafeTier.getExp());
                System.out.println("인증유저 댓글 업데이트 완료");
            }
        }

        return commentResponseList;
    }

    /**
     * 2-2. 댓글 쓰기 [테스트 완료 - step_no 랑 group_no 알고리즘만 경희랑 이야기해서 짜면될듯]
     **/
    @Override
    public int writeComment(CommentWriteRequestDTO commentWriteDto) throws Exception {
        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        // 2. 값 확인
        Long postId = commentWriteDto.getPostId();
        String content = commentWriteDto.getContent();
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        member = memberOptional.get();

        Optional<Post> postOptional = postRepository.findById(postId);
        if(postOptional.isEmpty() || postOptional == null) {
            System.out.println("댓글쓰기 중 : 글이 사라짐");
            return 1;
        }
        post = postOptional.get();

        // 3. 댓글 대댓글 구분
        Long groupNo = commentWriteDto.getGroup();
        if(groupNo == -1L) { // 댓글
            Optional<Comment> commentOptional = commentRepository.findTopByPostIdOrderByIdDesc(postId);
            if(commentOptional.isEmpty() || commentOptional == null) {
                groupNo = 1L;
            }else groupNo = commentOptional.get().getGroupNo() + 1L;
        }

        // 4. 글 저장하기
        Comment comment = Comment.CommentWriteBuilder()
                .group(groupNo)
                .member(member)
                .post(post)
                .content(content)
                .build();

        System.out.println(comment);
        // 인증 여부에 따라 글을 쓸수있다 - GeoAuth - 따로 필요없음
        commentRepository.save(comment);
        return 2;
    }

    /**
     * 2-2. 댓글 업데이트
     **/

    @Override
    public int updateComment(CommentUpdateRequestDTO commentUpdateDto) throws Exception{
        CheckedResponseDto checked = postUtil.checkMember();
        Long commentId = commentUpdateDto.getCommentId();

        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        Comment comment;
        if(optionalComment == null || optionalComment.isEmpty()) {
            return 1;
        }else {
            comment = optionalComment.get();
        }

        Long writerId = commentRepository.findById(commentId).get().getMember().getId();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        if(writerId != memberId) {
            // 글쓴이와 수정하려는 사람이 같지 않으면
            return 2;
        }
        String content = commentUpdateDto.getContent();
        if(content == null || content.isEmpty()) {
            // content 가 비어있어!
            return 3;
        }
        comment.updateComment(content);
        commentRepository.save(comment);
        return 4;
    }

    /**
     * 3. 댓글 좋아요
     **/
    @Override
    public CommentLikeResponseDto likeComment(CommentLikeRequestDto requestDto) throws Exception {
        Boolean responseIsChecked;

        //1. 유저 확인
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.
        boolean isChecked = requestDto.isChecked();
        Long commentId = requestDto.getCommentId();


        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if(optionalComment.isEmpty() || optionalComment == null) {
            System.out.println("댓글 좋아요 : 댓글 id 가 잘못됨 null");
            return null;
        }
        Comment comment = optionalComment.get();

        if (!isChecked) {
            CommentLike commentLike = CommentLike.CommentLikeBuilder()
                    .comment(comment)
                    .member(memberRepository.findById(memberId).get())
                    .build();
            commentLikeRepository.save(commentLike);
            responseIsChecked = true;
        }
        // True 라면 삭제
        else {
            commentLikeRepository.deleteById(commentId);
            responseIsChecked = false;
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
    public int deleteComment(Long commentId) throws Exception{
        //1. 유저를 확인한다.
        CheckedResponseDto checked = postUtil.checkMember();
        long memberId = checked.getMemberId(); // 멤버 아이디를 확인한다.

        //2. 유저(나) 와 댓글유저가 일치하는지 확인한다.
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if(commentOptional.isEmpty() || commentOptional == null) {
            return 1;
        }
        long commentMemberId = commentOptional.get().getMember().getId();

        if(memberId == commentMemberId) { // 글쓴이와 유저가 일치한다면 삭제
            commentRepository.deleteById(commentId);
            return 2;
        } else { // 유저가 일치하지 않는다면 badgateway
            return 3;
        }

    }
}
