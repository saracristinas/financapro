package com.financapro.dto.financeiro;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TransacaoResponseDto {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String type;
    private String category;
    private LocalDate date;
    private LocalDateTime createdAt;
}



