package com.financapro.dto.divida;

import lombok.Data;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DividaRequestDto {
    @NotBlank
    private String creditor;

    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @DecimalMin("0.00")
    private BigDecimal paidAmount;

    private LocalDate dueDate;

    private String status;
}




