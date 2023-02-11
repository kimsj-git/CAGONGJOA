package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<PostImage, Long> {

    void deleteAllByPostId(Long postId);

    List<PostImage> findAllByPostIdIn(List<Long> postId);

}
