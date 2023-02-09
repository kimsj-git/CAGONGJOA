package com.ssafy.backend.post.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.ssafy.backend.member.domain.dto.MemberIdAndNicknameDto;
import com.ssafy.backend.member.service.MemberServiceImpl;
import com.ssafy.backend.post.domain.dto.CheckedResponseDto;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostImage;
import com.ssafy.backend.post.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@RequiredArgsConstructor // 얘도 커스텀?
@Transactional
@Service
public class PostUtil {
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private PostImage postImage;
    private final ImageRepository imageRepository;
    private final MemberServiceImpl memberService;


    /**    0. 유저 확인   **/
    public CheckedResponseDto checkMember() throws Exception {

        // 1. accessToken 을 해독하여, payload 에서 memberId 와 nickname 을 가져온다.
        MemberIdAndNicknameDto memberIdAndNicknameDto = memberService.getMemberIdAndNicknameByJwtToken();
        Long memberId = memberIdAndNicknameDto.getId();
        String nickname = memberIdAndNicknameDto.getNickname();
        // 2. 카페 인증된 회원인지 확인하며, 인증되었다면 카페의 이름을 가져온다. KEY : 닉네임
        CheckedResponseDto checkedResponseDto = CheckedResponseDto.builder()
                .nickname(nickname)
                .memberId(memberId)
                .build();

        return checkedResponseDto;
    }



    public List<PostImage> imageUpload(MultipartFile[] multipartFiles) throws Exception {
        ObjectMetadata objectMetaData = new ObjectMetadata();
        List<PostImage> postImages = new ArrayList<>();

        for (MultipartFile multipartFile : multipartFiles) {
            long size = multipartFile.getSize(); // 파일 크기
            String originalName = multipartFile.getOriginalFilename(); // 파일 원래이름 (xxx.jpg) 갖고오기
            String randomName = UUID.randomUUID().toString().concat("-").concat(originalName);

            // 파일 형식 구하기
            String contentType = multipartFile.getContentType().toString();
            System.out.println("파일 확장자명 : " + contentType);

            //확장자 검사
//            assert contentType != null;
            if(contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png") || contentType.equals("image/jfif") || contentType.equals("image/gif") || contentType.equals("image/bmp") ) {

            }else {
                System.out.println("Exception 발생");
                return null;
            }

            objectMetaData.setContentType(multipartFile.getContentType()); // 이미지 타입 설정
            objectMetaData.setContentLength(size); // 사이즈 설정

            // S3에 업로드
            amazonS3.putObject(new PutObjectRequest(bucket, randomName, multipartFile.getInputStream(), objectMetaData)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

            // S3 서버에서 변환된 URL 가져오기
            String imagePath = amazonS3.getUrl(bucket, randomName).toString();

            postImage = PostImage.builder()
                    .imgUrl(imagePath)
                    .accessKey(randomName)
                    .build();

            postImages.add(postImage);
        }
        return postImages;
    }

    public void imageDelete(Post post, List<String> keyNameList) {

        List<PostImage> postImages = imageRepository.findAllByPostIdAndAccessKeyNotIn(post.getId(), keyNameList);
        // null 이면 이미지를 삭제하지 않고 바로 리턴하여 돌아간다.
        System.out.println("keynameList : " + keyNameList.toString());
        System.out.println("postImages : " + postImages.toString() );
        if(postImages.isEmpty() || postImages == null) {
            System.out.println("img empty!");
            return;
        }
        for(PostImage data : postImages) {
            // acess key를 가져와서 S3 데이터를 삭제한다.
            amazonS3.deleteObject(bucket, data.getAccessKey());
        }
        post.deleteImages();
        imageRepository.deleteAllByPostId(post.getId());

    }

}
