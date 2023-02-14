package com.ssafy.backend.post.repository;

import com.ssafy.backend.post.domain.entity.Post;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@SpringBootTest
public class PostRepositoryTest {

    @Autowired
    private PostRepository postRepository;

//    @Test
//    public void savePostTest() {
//        IntStream.rangeClosed(1,20).forEach(i -> {
//            Post post = Post.builder()
//                    .memberId(1L)
//                    .content("집에보내줘" + i + " 트")
//                    .type(Type.FREE)
//                    .build();
//
//            Post result =  postRepository.save(post);
//        });
//    }

    @Test
    public void selectTest() {
        Long id = 2L;
        Optional<Post> selectResult = postRepository.findById(id);
        Post post = selectResult.orElseThrow();
        System.out.println("셀렉트조회 :" + post);

    }

    @Test
    public void updateTest() {
        Long postId = 2L;
        Optional<Post> updateResult = postRepository.findById(postId);
        Post post = updateResult.orElseThrow();
        post.updateContent("New 집에가고싶다");

        postRepository.save(post);

    }

/*    @Test
    public void deleteTest() {
        Long postId = 2L;

        postRepository.deleteById(postId);
    }*/

    @Test
    public void pagingTest() {

        Pageable pageable = PageRequest.of(0,10, Sort.by("id").descending());

        Page<Post> result = postRepository.findAll(pageable);

        System.out.println("total count : " + result.getTotalElements());
        System.out.println("total pages : " + result.getTotalPages());
        System.out.println("page number : " + result.getNumber());
        System.out.println("page size : " + result.getSize());

        List<Post> postList = result.getContent();

        postList.forEach(post -> System.out.println(post));

    }

}