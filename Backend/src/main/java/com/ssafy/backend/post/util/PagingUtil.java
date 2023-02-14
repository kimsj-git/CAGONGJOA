package com.ssafy.backend.post.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.service.CafeServiceImpl;
import com.ssafy.backend.common.exception.jwt.JwtException;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.service.MemberServiceImpl;
import com.ssafy.backend.post.domain.dto.CheckedResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostImage;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.PostImageRepository;
import com.ssafy.backend.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.ssafy.backend.common.exception.jwt.JwtExceptionType.JWT_VERIFICATION_EXCEPTION;

@RequiredArgsConstructor // 얘도 커스텀?
@Transactional(readOnly = true)
@Service
public class PagingUtil {
    private final PostRepository postRepository;


    /**
     * 0. 유저 확인
     **/
    public Slice<Post> getPostFeeds(List<Long> cafeIdList, Long postId, List<PostType> types, Pageable pageable) {
        Slice<Post> postSlice;
        if (types.contains(PostType.hot)) { // 핫 게시물을 포함하고 있을 때

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("hot 첫번째요청");
                postSlice = postRepository.findHotPostNext(cafeIdList, Long.MAX_VALUE, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("hot 두번째이상 요청");
                postSlice = postRepository.findHotPostNext(cafeIdList, postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else { //

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("피드 첫번째 요청");
                postSlice = postRepository.findNextFeed(Long.MAX_VALUE, types, cafeIdList, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("두번째이상 요청");
                postSlice = postRepository.findNextFeed(postId, types, cafeIdList, pageable);
                // 갖고올 게시물이 없으면
            }
        }
        return postSlice;
    }


    public Slice<Post> getSearchedFeeds(List<Long> cafeIdList, Long postId, String searchKeyword, int searchType, Pageable pageable) {
        Slice<Post> postSlice;
        if (searchType == 1) { // 글 내용으로 찾기

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("글내용으로 찾기 첫번째 요청");
                postSlice = postRepository.findBySearchContentFirst(cafeIdList, searchKeyword, pageable);

            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("글내용으로 찾기 다음 요청");
                postSlice = postRepository.findBySearchContentNext(cafeIdList, searchKeyword, postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else if (searchType == 2) { // 유저 이름으로 찾기

            if (postId == -1L) {
                // 처음 요청할때 (refresh)
                System.out.println("유저 이름으로 찾기 첫번째 요청");
                postSlice = postRepository.findBySearchNicknameFirst(cafeIdList, searchKeyword, pageable);
            } else {
                // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
                System.out.println("유저 이름으로 찾기 다음 요청");
                postSlice = postRepository.findBySearchNicknameNext(cafeIdList, searchKeyword, postId, pageable);
                // 갖고올 게시물이 없으면
            }

        } else {
            throw new PostException(PostExceptionType.NOT_ALLOWED_TYPE);
        }

        return postSlice;
    }

    public Slice<Post> findMyFeeds(Long postId, Long memberId, Pageable pageable) {
        Slice<Post> postSlice;
        if (postId == -1L) {
            // 처음 요청할때 (refresh)
            System.out.println("글내용으로 찾기 첫번째 요청");
            postSlice = postRepository.findAllMyFeed(Long.MAX_VALUE,memberId, pageable);

        } else {
            // 두번째 이상으로 요청할 때 (마지막 글의 pk 를 기준으로 함)
            System.out.println("글내용으로 찾기 다음 요청");
            postSlice = postRepository.findAllMyFeed(postId,memberId, pageable);
            // 갖고올 게시물이 없으면
        }
//         post를 slice 형태로 갖고오기

        if (postSlice.isEmpty() || postSlice == null) { // 불러올 게시물이 없을 때
            throw new PostException(PostExceptionType.NO_POST_FEED);
        }
        return postSlice;


    }


}
