package com.financapro.dto.financeiro;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PainelResponseDto {
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal savings;
    private BigDecimal debts;
    private BigDecimal balance;
    private List<ResumoCategoriaDto> categorySummaries;
    private List<TransacaoResponseDto> recentTransactions;
}



