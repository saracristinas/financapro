package com.financapro.dto.equipe;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class ConviteRequestDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String role;
}




