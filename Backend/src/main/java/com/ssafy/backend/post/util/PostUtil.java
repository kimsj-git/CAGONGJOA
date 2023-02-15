package com.ssafy.backend.post.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.ssafy.backend.cafe.domain.dto.ClientPosInfoDto;
import com.ssafy.backend.cafe.domain.dto.NearByCafeResultDto;
import com.ssafy.backend.cafe.service.CafeServiceImpl;
import com.ssafy.backend.common.exception.post.PostException;
import com.ssafy.backend.common.exception.post.PostExceptionType;
import com.ssafy.backend.member.service.MemberServiceImpl;
import com.ssafy.backend.post.domain.entity.Post;
import com.ssafy.backend.post.domain.entity.PostImage;
import com.ssafy.backend.post.repository.PostImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor // 얘도 커스텀?
@Transactional
@Service
public class PostUtil {
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final PostImageRepository imageRepository;
    private final MemberServiceImpl memberService;
    private final CafeServiceImpl cafeService;


    public List<PostImage> imageUpload(Post post, MultipartFile[] multipartFiles) {
        ObjectMetadata objectMetaData = new ObjectMetadata();
        List<PostImage> postImages = imageRepository.findAllByPostId(post.getId());

        if (postImages == null || postImages.isEmpty()) {
            postImages = new ArrayList<>();
        }
        System.out.println("postImageList : " + postImages);
        for (MultipartFile multipartFile : multipartFiles) {
            if(multipartFile.isEmpty() || multipartFile == null) continue;
            long size = multipartFile.getSize(); // 파일 크기
            System.out.println("파일 사이즈 : " + size);
            String originalName = multipartFile.getOriginalFilename(); // 파일 원래이름 (xxx.jpg) 갖고오기
            String randomName = UUID.randomUUID().toString().concat("-").concat(originalName);

            // 파일 형식 구하기
            String contentType = multipartFile.getContentType().toString();

            //확장자 검사
            if (contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png") || contentType.equals("image/jfif") || contentType.equals("image/gif") || contentType.equals("image/bmp")) {

            } else {
                throw new PostException(PostExceptionType.NOT_ALLOWED_IMAGE_TYPE);
            }

            objectMetaData.setContentType(multipartFile.getContentType()); // 이미지 타입 설정
            objectMetaData.setContentLength(size); // 사이즈 설정

            // S3에 업로드
            try {
                amazonS3.putObject(new PutObjectRequest(bucket, randomName, multipartFile.getInputStream(), objectMetaData)
                        .withCannedAcl(CannedAccessControlList.PublicRead));
            } catch (IOException e) {
                throw new PostException(PostExceptionType.IMAGE_IO_EXCEPTION);
            }

            // S3 서버에서 변환된 URL 가져오기
            String imagePath = amazonS3.getUrl(bucket, randomName).toString();

            PostImage postImage = PostImage.builder()
                    .imgUrl(imagePath)
                    .post(post)
                    .accessKey(randomName)
                    .build();

            postImages.add(postImage);
        }
        List<PostImage> postImageList = imageRepository.saveAll(postImages);
        System.out.println("이미지 저장완료!");
        System.out.println("이미지 : " + postImageList);
        return postImageList;
    }

    public void imageDelete(Post post, List<String> imgUrlList) {

        List<PostImage> postImages = imageRepository.findAllByPostIdAndImgUrlNotIn(post.getId(), imgUrlList);
        // null 이면 이미지를 삭제하지 않고 바로 리턴하여 돌아간다.
        if (postImages.isEmpty() || postImages == null) {
            System.out.println("img empty!");
            return;
        }
        List<Long> deleteIdList = new ArrayList<>();
        for (PostImage data : postImages) {
            // acess key를 가져와서 S3 데이터를 삭제한다.
            amazonS3.deleteObject(bucket, data.getAccessKey());
            deleteIdList.add(data.getId());
        }
        imageRepository.deleteAllByIdIn(deleteIdList);

    }

    public List<Long> getNearByCafeIdList(Double latitude, Double longitude, Double dist) {

        // 3. 주변 카페들 정보 알아오기 - 주변 카페에 해당되는 글들만 된다.
        ClientPosInfoDto clientPosInfoDto = new ClientPosInfoDto(latitude, longitude, dist);
        List<NearByCafeResultDto> nearByCafeResultDtos = cafeService.getNearByCafeLocations(clientPosInfoDto);

        if (nearByCafeResultDtos.isEmpty() || nearByCafeResultDtos == null) {
            throw new PostException(PostExceptionType.NO_CAFE_AROUND);
        } else {
            System.out.println(" 글 불러오기 - 주변 카페 개수 : " + nearByCafeResultDtos.size() + "개       " + nearByCafeResultDtos);
        }
        // cafe id 만 전달해줄거임
        List<Long> cafeIdList = new ArrayList<>();
        for (NearByCafeResultDto dto : nearByCafeResultDtos) {
            cafeIdList.add(dto.getId().longValue());
        }
        System.out.println("주변 카페 Id 리스트 전달완료!");
        return cafeIdList;
    }

}
