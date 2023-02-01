package com.ssafy.backend.common.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class AWSConfig {

    @Value("${cloud.aws.credentials.access-key}")
    private String iamAccessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String iamSecretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Builder(builderClassName = "AWSImgBuiler", builderMethodName = "AWSImgBuiler")
    public AmazonS3 uploadAWSImg() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(iamAccessKey, iamSecretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }
}
