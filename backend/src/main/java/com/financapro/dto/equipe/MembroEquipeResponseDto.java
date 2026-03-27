package com.financapro.dto.equipe;

import lombok.Data;

@Data
public class MembroEquipeResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String avatarColor;
}



