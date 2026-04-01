package com.financapro.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email) {
        try {
            String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
            log.info("[JWT-GERAÇÃO] ✅ Token JWT gerado com SUCESSO para usuário: {}", email);
            return token;
        } catch (Exception e) {
            log.error("[JWT-GERAÇÃO] ❌ FALHA ao gerar token para usuário {}: {}", email, e.getMessage());
            throw e;
        }
    }

    public String extractEmail(String token) {
        try {
            String email = Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
            log.debug("[JWT-EXTRAÇÃO] ✓ Email extraído do token: {}", email);
            return email;
        } catch (Exception e) {
            log.warn("[JWT-EXTRAÇÃO] ⚠️ Falha ao extrair email do token: {}", e.getMessage());
            throw e;
        }
    }

    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
            log.debug("[JWT-VALIDAÇÃO] ✓ Token JWT válido e não expirado");
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("[JWT-VALIDAÇÃO] ⚠️ Token JWT EXPIRADO - usuário precisa fazer login novamente");
            return false;
        } catch (MalformedJwtException e) {
            log.warn("[JWT-VALIDAÇÃO] ⚠️ Token JWT MALFORMADO - formato inválido");
            return false;
        } catch (UnsupportedJwtException e) {
            log.warn("[JWT-VALIDAÇÃO] ⚠️ Token JWT NÃO SUPORTADO");
            return false;
        } catch (SignatureException e) {
            log.warn("[JWT-VALIDAÇÃO] ⚠️ Assinatura do Token JWT INVÁLIDA - possível tentativa de falsificação");
            return false;
        } catch (JwtException e) {
            log.warn("[JWT-VALIDAÇÃO] ⚠️ Token JWT inválido: {}", e.getMessage());
            return false;
        }
    }
}



