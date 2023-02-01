package com.ssafy.backend.post.repository;


import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<PostImage, Long> {

}
