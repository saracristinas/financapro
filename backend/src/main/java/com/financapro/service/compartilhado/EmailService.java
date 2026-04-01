package com.financapro.service.compartilhado;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private static EmailResultado ultimoResultado;

    @Value("${spring.mail.username:}")
    private String emailRemetente;

    @Async
    public void enviarConviteEquipe(String emailDestinatario, String nomeConvidador, String linkAceitar) {
        // Validar se as credenciais estão configuradas
        if (emailRemetente == null || emailRemetente.isBlank()) {
            String msg = "Email não foi enviado - credenciais de email não configuradas no servidor";
            log.warn(msg);
            ultimoResultado = EmailResultado.erro(msg);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailRemetente);
            message.setTo(emailDestinatario);
            message.setSubject("🎉 Convite para FinançaPro - Equipe");
            message.setText(construirMensagemConvite(nomeConvidador, linkAceitar));

            mailSender.send(message);
            String msg = "Email enviado com sucesso para: " + emailDestinatario;
            log.info(msg);
            ultimoResultado = EmailResultado.sucesso(msg);
        } catch (Exception e) {
            String msg = "Erro ao enviar email para " + emailDestinatario + ": " + e.getMessage();
            log.error(msg);
            ultimoResultado = EmailResultado.erro(msg);
        }
    }

    public EmailResultado obterUltimoResultado() {
        if (ultimoResultado == null) {
            return EmailResultado.sucesso("Email sendo processado em background");
        }
        return ultimoResultado;
    }

    private String construirMensagemConvite(String nomeConvidador, String linkAceitar) {
        return "Olá!\n\n" +
                nomeConvidador + " te convidou para fazer parte de sua equipe no FinançaPro!\n\n" +
                "FinançaPro é uma plataforma completa de gerenciamento financeiro pessoal e em equipe.\n\n" +
                "Clique no link abaixo para aceitar o convite:\n" +
                linkAceitar + "\n\n" +
                "Se você não esperava esse convite, pode ignorar este email.\n\n" +
                "---\n" +
                "FinançaPro Team\n" +
                "https://financapro-1.onrender.com";
    }
}



