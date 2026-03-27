package com.financapro.dto.financeiro;

import com.financapro.model.financeiro.Transaction;
import lombok.Data;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransacaoRequestDto {
    @NotBlank
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotNull
    private Transaction.Type type;

    private Transaction.Category category;

    @NotNull
    private LocalDate date;
}



