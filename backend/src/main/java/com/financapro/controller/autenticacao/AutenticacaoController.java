package com.financapro.controller.autenticacao;

import com.financapro.dto.autenticacao.AutenticacaoResponseDto;
import com.financapro.dto.autenticacao.CadastroRequestDto;
import com.financapro.dto.autenticacao.LoginRequestDto;
import com.financapro.dto.autenticacao.RecuperarSenhaRequestDto;
import com.financapro.dto.autenticacao.RedefinirSenhaRequestDto;
import com.financapro.service.autenticacao.AutenticacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/register")
    public ResponseEntity<AutenticacaoResponseDto> register(@Valid @RequestBody CadastroRequestDto req) {
        return ResponseEntity.ok(autenticacaoService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AutenticacaoResponseDto> login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.ok(autenticacaoService.login(req));
    }

    @PostMapping("/forgot-password-question")
    public ResponseEntity<Map<String, String>> getSecurityQuestion(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String question = autenticacaoService.getSecurityQuestion(email);
        return ResponseEntity.ok(Map.of("securityQuestion", question));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody RedefinirSenhaRequestDto req) {
        autenticacaoService.resetPassword(req);
        return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso"));
    }
}
