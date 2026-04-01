# 👑 Criando usuário ADMIN

## Opção 1: Via SQL (Recomendado para Render)

Se você tem acesso ao PostgreSQL do Render:

1. **Abra o console PostgreSQL do Render**
2. **Execute o comando SQL:**

```sql
INSERT INTO users (email, password, name, avatar_color, role, security_question, security_answer, created_at)
VALUES (
    'admin@financapro.com',
    '$2a$10$slYQmyNdGzin7olVAklFOOJyhtsDMi0rB7xWfXQpl2.P2zDh3xZK2',
    'Admin',
    '#f59e0b',
    'ADMIN',
    'Qual é o seu sobrenome?',
    'admin',
    NOW()
);
```

**Credenciais de login:**
- Email: `admin@financapro.com`
- Senha: `Admin@123`

---

## Opção 2: Via Java Local

Se quer gerar o hash manualmente:

```bash
cd backend
mvn exec:java -Dexec.mainClass="com.financapro.util.PasswordHashGenerator"
```

Isso vai gerar um hash BCrypt que você pode usar.

---

## Opção 3: Registrar via UI

1. Acesse o app: https://financapro-1.onrender.com
2. Clique em **Registrar**
3. Preencha os dados:
   - Email: seu email real ou `teste@admin.com`
   - Senha: algo seguro
   - Pergunta de segurança
4. Após registrar, **atualize a role manualmente no banco:**

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu-email@aqui.com';
```

---

## 🔑 Qual hash usar?

O hash `$2a$10$slYQmyNdGzin7olVAklFOOJyhtsDMi0rB7xWfXQpl2.P2zDh3xZK2` corresponde à senha: **`Admin@123`**

Se quiser usar outra senha, rode o PasswordHashGenerator ou use um gerador BCrypt online.

---

## ✅ Verificar se funcionou

Tente fazer login com:
- Email: `admin@financapro.com`
- Senha: `Admin@123`

Se der erro 403 no convite, o problema é o **JWT não estar sendo enviado**. 
Verifique os logs do backend para debug.

