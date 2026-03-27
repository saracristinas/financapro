package com.financapro.dto.financeiro;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DadosMensaisDto {
    private String month;
    private int monthNumber;
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal savings;
}


