package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<PostImage, Long> {

    List<PostImage> findAllByPostId(Long id);

    void deleteAllByIdIn(List<Long> deleteIdList);

    List<PostImage> findAllByPostIdAndIdNotIn(Long postId, List<Long> idList);

}
