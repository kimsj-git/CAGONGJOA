package com.ssafy.backend.user.domain.entity.embeded;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class Period {

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
