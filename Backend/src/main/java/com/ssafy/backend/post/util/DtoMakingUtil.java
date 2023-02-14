package com.ssafy.backend.post.util;


import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.post.domain.entity.Comment;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.enums.PostType;
import com.ssafy.backend.post.repository.CommentRepository;
import com.ssafy.backend.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor // 얘도 커스텀?
@Transactional(readOnly = true)
@Service
public class DtoMakingUtil {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;


    /**
     * 0. 유저 확인
     **/




}
