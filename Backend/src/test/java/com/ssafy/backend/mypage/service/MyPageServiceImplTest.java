package com.ssafy.backend.mypage.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

class MyPageServiceImplTest {

    @Test
    void intToLocalDate() {
        int dateInt = 20221010;
        LocalDate date = LocalDate.parse(String.valueOf(dateInt), DateTimeFormatter.ofPattern("yyyyMMdd"));
        String formattedDate = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        System.out.println(formattedDate); // 20221010
    }

    @Test
    void LocatDateToIntTest(){
        LocalDate localDate = LocalDate.parse("2021-11-12");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = localDate.format(formatter);
        int intDate = Integer.parseInt(formattedDate);
        System.out.println("intDate = " + intDate);

        int resIntDate = intDate / 100;
        System.out.println("resIntDate = " + resIntDate);
    }

    @Test
    void LocalDateTest() {
        String string = "2019-01-10";

        LocalDate date = LocalDate.parse(string, DateTimeFormatter.ISO_DATE);
        System.out.println(date);
        System.out.println(date.getDayOfWeek());
        System.out.println(date.getDayOfMonth());
        System.out.println(date.getMonthValue());

        //해당 월의 마지막 날
        LocalDate lastDate = date.withDayOfMonth(date.lengthOfMonth());
        System.out.println("lastDate = " + lastDate);
        System.out.println("lastDate = " + lastDate);
    }

}