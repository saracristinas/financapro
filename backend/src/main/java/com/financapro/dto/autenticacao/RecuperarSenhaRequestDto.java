package com.financapro.dto.autenticacao;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class RecuperarSenhaRequestDto {
    @NotBlank
    @Email
    private String email;
}

