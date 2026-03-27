package com.financapro.dto.economia;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EconomiaResponseDto {
    private Long id;
    private String name;
    private BigDecimal goal;
    private BigDecimal current;
    private String emoji;
    private String color;
    private LocalDate deadline;
    private double percentage;
}



