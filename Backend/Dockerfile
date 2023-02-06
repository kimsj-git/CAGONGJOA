# FROM은 베이스 이미지(Base image)를 지정
FROM adoptopenjdk:11-hotspot

# COPY server/gradlew .
# COPY server/gradle gradle
# COPY server/build.gradle .
# COPY server/settings.gradle .
# COPY server/src src

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# RUN 은 말 그대로 command 를 실행(run)하여 새 이미지에 포함시키는 역할

RUN chmod +x ./gradlew
# 실행 가능한 jar파일 생성
RUN ./gradlew bootJar

# base image
FROM adoptopenjdk:11-hotspot
# builder 이미지에서 build/libs/*.jar 파일을 app.jar로 복사
COPY --from=0 build/libs/*.jar app.jar

EXPOSE 9000
ENTRYPOINT ["java","-jar", "/app.jar"]
