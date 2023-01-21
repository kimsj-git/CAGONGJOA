package com.ssafy.backend.user.domain.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class MemberLoginInfo {

    @Id @GeneratedValue
    private Long id;
}
