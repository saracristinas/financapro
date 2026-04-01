package com.financapro.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitário para gerar hash de senhas BCrypt
 * Use para gerar senhas para inserção manual no banco de dados
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Senha padrão para admin
        String senha = "Admin@123";
        String hash = encoder.encode(senha);
        
        System.out.println("======================================");
        System.out.println("GERADOR DE HASH BCRYPT");
        System.out.println("======================================");
        System.out.println("Senha: " + senha);
        System.out.println("Hash:  " + hash);
        System.out.println("======================================");
    }
}

