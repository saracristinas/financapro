package com.financapro.dto.autenticacao;

import com.financapro.model.autenticacao.User;
import lombok.Data;

@Data
public class AutenticacaoResponseDto {
    private String token;
    private String name;
    private String email;
    private User.Role role;
}



