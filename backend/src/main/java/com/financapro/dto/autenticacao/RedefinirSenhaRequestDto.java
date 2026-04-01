package com.financapro.dto.autenticacao;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RedefinirSenhaRequestDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String securityAnswer;

    @NotBlank
    @Size(min = 6, max = 120)
    private String newPassword;
}

