package com.ssafy.backend.common.interceptor;

import com.ssafy.backend.cafe.service.CafeService;
import com.ssafy.backend.common.annotation.Auth;
import com.ssafy.backend.common.annotation.CafeAuth;
import com.ssafy.backend.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class CafeAuthInterceptor implements HandlerInterceptor {

    private final CafeService cafeService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod method = (HandlerMethod) handler;

        // CafeAuth 어노테이션이 없으면 true
        CafeAuth cafeAuth = method.getMethodAnnotation(CafeAuth.class);
        if(cafeAuth == null) {
            return true;
        }

        // 카페 인증 상태를 체크 -> 미인증시 401
        cafeService.checkCafeAuth();

        return true;
    }
}
