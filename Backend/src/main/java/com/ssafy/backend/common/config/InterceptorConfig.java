package com.ssafy.backend.common.config;

import com.ssafy.backend.common.interceptor.AuthInterceptor;
import com.ssafy.backend.common.interceptor.CafeAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    private final CafeAuthInterceptor cafeAuthInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/**");
        registry.addInterceptor(cafeAuthInterceptor)
                .addPathPatterns("/**");
    }
}