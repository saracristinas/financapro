package com.financapro.controller.autenticacao;

import com.financapro.dto.autenticacao.AutenticacaoResponseDto;
import com.financapro.dto.autenticacao.CadastroRequestDto;
import com.financapro.dto.autenticacao.LoginRequestDto;
import com.financapro.service.autenticacao.AutenticacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}





