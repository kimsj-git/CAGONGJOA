package com.ssafy.backend.post.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.backend.jwt.JwtUtil;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Getter
public class PostUtil {
    private JwtUtil jwtUtil;
    private AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public long userTest() throws Exception {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String accessToken = request.getHeader("Authorization");
        System.out.println("어세스토큰 : " + accessToken);
        accessToken = accessToken.substring(7);
        DecodedJWT payload = jwtUtil.getDecodedJWT(accessToken);
        long memberId = Integer.parseInt(payload.getAudience().get(0));
        System.out.println(memberId);
        return memberId;

    }

    public List<String> imageUpload(MultipartFile[] multipartFiles) throws Exception {
        List<String> imagePathList = new ArrayList<>();
        ObjectMetadata objectMetaData = new ObjectMetadata();

        for(MultipartFile multipartFile: multipartFiles) {
            long size = multipartFile.getSize(); // 파일 크기
            String originalName = multipartFile.getOriginalFilename(); // 파일 원래이름 (xxx.jpg) 갖고오기
            String randomName = UUID.randomUUID().toString().concat("-").concat(originalName);

            // 파일 형식 구하기
            String contentType = multipartFile.getContentType().toString();
            System.out.println("파일 확장자명 : " + contentType);

//            확장자 검사
//            assert contentType != null;
//            if(contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png") || contentType.equals("image/jfif") || contentType.equals("image/gif") || contentType.equals("image/bmp") ) {
//                System.out.println("Exception 발생");
//                return null;
//            }

            objectMetaData.setContentType(multipartFile.getContentType()); // 이미지 타입 설정
            objectMetaData.setContentLength(size); // 사이즈 설정

            // S3에 업로드
            amazonS3.putObject(new PutObjectRequest(bucket, randomName,multipartFile.getInputStream(), objectMetaData)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

            // S3 서버에서 변환된 URL 가져오기
            String imagePath = amazonS3.getUrl(bucket, randomName).toString();
            imagePathList.add(imagePath);
        }

        return imagePathList;
    }
}
