package com.financapro.service.compartilhado;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailResultado {
    private boolean sucesso;
    private String mensagem;

    public static EmailResultado sucesso(String mensagem) {
        return new EmailResultado(true, mensagem);
    }

    public static EmailResultado erro(String mensagem) {
        return new EmailResultado(false, mensagem);
    }
}

