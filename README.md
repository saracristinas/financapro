# FinancaPro

Aplicacao full-stack para controle financeiro pessoal com autenticacao JWT, dashboard, metas, dividas, analytics anual, equipe e chat com IA.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Java 17 + Spring Boot 3 |
| Banco | PostgreSQL (padrao) |
| Auth | Spring Security + JWT |
| IA | Anthropic Claude API (via backend) |

## Estrutura do projeto

```text
financapro/
  backend/    # API Spring Boot
  frontend/   # App React (Vite)
```

## Guia completo para rodar do zero

### 1) Pre-requisitos

Voce precisa ter instalado:

- Java 17
- Maven 3.9+
- Node 18+ (recomendado 20+)
- npm
- Docker Desktop

### 2) Validar ambiente local

Rode estes comandos antes de tudo:

```bash
java -version
mvn -version
node -v
npm -v
docker --version
```

Se `mvn -version` reclamar de `JAVA_HOME`, configure para Java 17:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

Para deixar permanente no macOS (zsh):

```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 3) Banco de dados (PostgreSQL via Docker)

> Importante: abra o Docker Desktop e espere ele ficar pronto.

#### Opcao A (porta 5432 livre)

```bash
docker rm -f financapro-db
docker run --name financapro-db \
  -e POSTGRES_DB=financapro \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

#### Opcao B (porta 5432 ocupada no seu computador)

Use a porta `5433` no host:

```bash
docker rm -f financapro-db
docker run --name financapro-db \
  -e POSTGRES_DB=financapro \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  -d postgres:15
```

Checagens uteis:

```bash
docker ps
docker logs --tail 50 financapro-db
docker exec financapro-db psql -U postgres -d financapro -c "\du"
```

### 4) Rodar backend

Em um terminal separado:

```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
mvn spring-boot:run
```

Backend sobe em `http://localhost:8080`.

Se voce usou banco na porta `5433`, rode assim sem editar arquivo:

```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.url=jdbc:postgresql://localhost:5433/financapro --spring.datasource.username=postgres --spring.datasource.password=postgres"
```

### 5) Rodar frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend sobe em `http://localhost:5173`.

### 6) Teste rapido de funcionamento

1. Abra `http://localhost:5173`.
2. Crie uma conta (ou faca login).
3. Va para `Gastos` e crie uma transacao.
4. Confira `Dashboard`, `Economias` e `Dividas`.

## Variaveis de ambiente

### Backend

Arquivo: `backend/src/main/resources/application.yml`

Valores principais usados por padrao:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/financapro
    username: postgres
    password: postgres

jwt:
  secret: financapro-super-secret-key-change-in-production-32chars
  expiration: 86400000

anthropic:
  api-key: ${ANTHROPIC_API_KEY:your-anthropic-api-key-here}
```

Para habilitar IA real, defina a chave antes de subir o backend:

```bash
export ANTHROPIC_API_KEY="sua_chave_aqui"
```

### Frontend

Arquivo opcional: `frontend/.env` (baseado em `frontend/.env.example`)

```dotenv
VITE_API_URL=http://localhost:8080/api
```

Se `VITE_API_URL` nao estiver definido, o frontend usa `/api` e o proxy do Vite (`frontend/vite.config.js`) redireciona para `http://localhost:8080`.

## Endpoints principais

| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET | `/api/dashboard` | Dados do dashboard por mes/ano |
| GET/POST/DELETE | `/api/transactions` | CRUD de transacoes |
| GET/POST/PUT/DELETE | `/api/savings` | CRUD de metas |
| GET/POST/PUT/DELETE | `/api/debts` | CRUD de dividas |
| GET | `/api/analytics/monthly` | Serie anual |
| GET/POST/DELETE | `/api/team` | Equipe/convites |
| POST | `/api/ai/chat` | Chat com IA |

## Troubleshooting (erros comuns)

### Erro `JAVA_HOME environment variable is not defined correctly`

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
mvn -version
```

### Erro `Bind for 0.0.0.0:5432 failed: port is already allocated`

Algum processo ja usa 5432. Veja quem:

```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
docker ps
```

Solucao simples: subir o banco do projeto em `5433` (veja Opcao B acima).

### Erro `Cannot connect to the Docker daemon`

Docker Desktop nao esta pronto. Abra o app e teste:

```bash
docker info
```

### Erro `FATAL: role "postgres" does not exist`

Seu banco atual nao foi criado com usuario `postgres`. Recrie o container com:

```bash
docker rm -f financapro-db
docker run --name financapro-db \
  -e POSTGRES_DB=financapro \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### Frontend abre, mas login falha

- Confirme backend rodando em `8080`.
- Verifique URL da API no frontend (`VITE_API_URL` ou proxy).

## Comandos para parar tudo

Parar frontend/backend: `Ctrl + C` em cada terminal.

Parar banco Docker:

```bash
docker stop financapro-db
```

Subir de novo depois:

```bash
docker start financapro-db
```

Remover banco do projeto (container):

```bash
docker rm -f financapro-db
```
