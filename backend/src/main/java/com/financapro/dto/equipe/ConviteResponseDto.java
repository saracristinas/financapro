package com.financapro.dto.equipe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConviteResponseDto {
    private MembroEquipeResponseDto membro;
    private EmailStatusDto emailStatus;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailStatusDto {
        private boolean enviado;
        private String mensagem;
    }
}

