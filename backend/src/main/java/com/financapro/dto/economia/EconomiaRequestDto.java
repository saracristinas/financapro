package com.financapro.dto.economia;

import lombok.Data;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EconomiaRequestDto {
    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal goal;

    @DecimalMin("0.00")
    private BigDecimal current;

    private String emoji;

    private String color;

    private LocalDate deadline;
}



