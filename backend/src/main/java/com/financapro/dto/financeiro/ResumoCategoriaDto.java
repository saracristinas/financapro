package com.financapro.dto.financeiro;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResumoCategoriaDto {
    private String category;
    private BigDecimal total;
}



