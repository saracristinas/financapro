package com.financapro.dto.divida;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DividaResponseDto {
    private Long id;
    private String creditor;
    private String description;
    private BigDecimal amount;
    private BigDecimal paidAmount;
    private LocalDate dueDate;
    private String status;
}



