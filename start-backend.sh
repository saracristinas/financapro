#!/bin/bash

# Script para iniciar o FinançaPro Backend localmente com todas as variáveis de ambiente

export JAVA_HOME=$(/usr/libexec/java_home)

# Variáveis de Banco de Dados
export DB_URL="jdbc:postgresql://localhost:5432/financapro"
export DB_USER="sarasales"
export DB_PASSWORD=""

# Variáveis de Segurança
export JWT_SECRET="d62fa5b53d866dfc663c1f0fcea0378c52e595eac6ab58e98fd206268c2bb79b"

# Variáveis de Email (Gmail)
export MAIL_HOST="smtp.gmail.com"
export MAIL_PORT="587"
export MAIL_USERNAME="sarasales17062000@gmail.com"
export MAIL_PASSWORD="nlyf ntwq mmln fpwz"

echo "🚀 Iniciando FinançaPro Backend..."
echo "📧 Email configurado: $MAIL_USERNAME"
echo "🗄️ Banco de dados: $DB_URL"
echo ""

# Iniciar o backend
java -jar ./backend/target/financapro-backend-1.0.0.jar


