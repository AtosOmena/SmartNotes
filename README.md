# SmartNotes API

API RESTful para gerenciamento de notas pessoais. Cada usuário cria uma conta e gerencia suas próprias notas com isolamento total entre contas.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Linguagem | TypeScript |
| ORM | Prisma v7 |
| Banco de dados | MySQL 8 |
| Validação | Joi |
| Autenticação | express-session |
| Hash de senha | bcryptjs |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Docker](https://www.docker.com/) (recomendado para o banco de dados)
- npm v9 ou superior

---

## Instalação e configuração

### 1. Clone o repositório e acesse a pasta

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `backend/`:

```env
DATABASE_URL="mysql://root:root123@localhost:3306/smartnotes"
SESSION_SECRET="um_segredo_longo_e_aleatorio_aqui"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
PORT=3333
```

> **Importante:** nunca suba o `.env` para o repositório.

### 4. Suba o banco de dados com Docker

```bash
docker run --name smartnotes-db \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=smartnotes \
  -p 3306:3306 \
  -d mysql:8
```

Aguarde ~10 segundos para o MySQL inicializar completamente.

### 5. Execute as migrations e gere o client Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Inicie o servidor

```bash
npm run dev
```

A API estará disponível em **http://localhost:3333**.

---

## Estrutura de arquivos

```
backend/
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Configuração Express (middlewares globais)
│   ├── lib/
│   │   └── prisma.ts             # Instância singleton do PrismaClient
│   ├── router/
│   │   ├── index.ts              # Router raiz
│   │   └── v1Router.ts           # Router /v1
│   ├── middlewares/
│   │   ├── isAuth.ts             # Verifica sessão ativa
│   │   └── validateBody.ts       # Validação Joi do body
│   └── resources/
│       ├── auth/
│       │   ├── auth.router.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.schema.ts
│       │   └── auth.types.ts
│       └── note/
│           ├── note.router.ts
│           ├── note.controller.ts
│           ├── note.service.ts
│           ├── note.schema.ts
│           └── note.types.ts
├── prisma/
│   └── schema.prisma
├── prisma.config.ts
├── .env
└── package.json
```

---

## Endpoints

Todos os endpoints respondem sob o prefixo `/v1`.

### Autenticação — `/v1/auth`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/v1/auth/signup` | Cria nova conta | Não |
| POST | `/v1/auth/login` | Autentica e inicia sessão | Não |
| POST | `/v1/auth/logout` | Encerra a sessão | Sim |

### Notas — `/v1/notes`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/v1/notes` | Lista todas as notas do usuário | Sim |
| POST | `/v1/notes` | Cria uma nova nota | Sim |
| GET | `/v1/notes/:id` | Retorna uma nota pelo ID | Sim |
| PUT | `/v1/notes/:id` | Atualiza uma nota | Sim |
| DELETE | `/v1/notes/:id` | Remove uma nota | Sim |

---

## Testando a API

### Com curl

> **Dica:** use a flag `-c cookies.txt -b cookies.txt` para persistir o cookie de sessão entre comandos.

#### 1. Criar conta

```bash
curl -s -X POST http://localhost:3333/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","fullname":"Nome Completo","password":"Senha@123"}' \
  | jq
```

Resposta esperada (`201`):
```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "fullname": "Nome Completo",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### 2. Login

```bash
curl -s -c cookies.txt -X POST http://localhost:3333/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"Senha@123"}' \
  | jq
```

Resposta esperada (`200`):
```json
{ "msg": "Usuário autenticado" }
```

#### 3. Criar nota

```bash
curl -s -c cookies.txt -b cookies.txt \
  -X POST http://localhost:3333/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha primeira nota","content":"Conteúdo da nota aqui"}' \
  | jq
```

Resposta esperada (`201`):
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Minha primeira nota",
  "content": "Conteúdo da nota aqui",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### 4. Listar notas

```bash
curl -s -b cookies.txt http://localhost:3333/v1/notes | jq
```

#### 5. Buscar nota por ID

```bash
curl -s -b cookies.txt http://localhost:3333/v1/notes/<ID_DA_NOTA> | jq
```

#### 6. Atualizar nota

```bash
curl -s -c cookies.txt -b cookies.txt \
  -X PUT http://localhost:3333/v1/notes/<ID_DA_NOTA> \
  -H "Content-Type: application/json" \
  -d '{"title":"Título atualizado","content":"Conteúdo atualizado"}' \
  | jq
```

#### 7. Deletar nota

```bash
curl -s -b cookies.txt -X DELETE http://localhost:3333/v1/notes/<ID_DA_NOTA>
```

Resposta esperada: `204 No Content` (sem body).

#### 8. Logout

```bash
curl -s -c cookies.txt -b cookies.txt \
  -X POST http://localhost:3333/v1/auth/logout \
  | jq
```

---

### Com Insomnia ou Postman

1. Importe a coleção ou crie as requisições manualmente.
2. **Importante:** ative o gerenciamento de cookies no cliente para que o cookie de sessão seja enviado automaticamente após o login.
   - No Insomnia: certifique-se de que *Cookie Jar* está habilitado na aba do ambiente.
   - No Postman: cookies são gerenciados automaticamente pelo Postman Agent.

---

## Validações de entrada

### Senha (signup)

- Mínimo 8 caracteres, máximo 128
- Pelo menos uma letra minúscula
- Pelo menos uma letra maiúscula
- Pelo menos um número
- Pelo menos um caractere especial

### Título da nota

- Mínimo 3 caracteres, máximo 100

### Conteúdo da nota

- Mínimo 1 caractere

Erros de validação retornam `422` com o seguinte formato:

```json
{
  "errors": ["\"password\" must have at least 1 uppercase letter"]
}
```

---

## Segurança implementada

| Item | Implementação |
|---|---|
| Segredos em variáveis de ambiente | Todas as credenciais lidas do `.env` via `dotenv` |
| Hash de senha | `bcryptjs` com salt 10 — senhas nunca armazenadas em texto puro |
| Cookie de sessão seguro | `httpOnly`, `sameSite: lax`, `secure: true` em produção |
| Proteção IDOR | Todas as queries de nota filtram por `userId` — retorna `404` e nunca `403` |
| Rate limiting global | 100 requisições por IP a cada 15 minutos |
| Rate limiting nos endpoints de auth | 10 requisições por IP a cada 15 minutos |
| CORS restrito | Aceita requisições apenas da origem configurada em `FRONTEND_URL` |
| Cabeçalhos HTTP seguros | `helmet` com `X-Powered-By` removido, `noSniff` e `HSTS` ativos |
| Proteção contra timing attack | `bcrypt.compare` executa sempre, mesmo quando o e-mail não existe |

---

## Scripts disponíveis

```bash
npm run dev      # Inicia em modo desenvolvimento com hot reload (nodemon + ts-node)
npm run build    # Compila TypeScript para JavaScript em /dist
npm start        # Inicia a versão compilada (requer npm run build antes)
```

---

## Comandos Prisma úteis

```bash
npx prisma migrate dev --name <nome>   # Cria e aplica nova migration
npx prisma generate                    # Regenera o Prisma Client
npx prisma studio                      # Abre interface visual do banco no browser
npx prisma migrate reset               # Reseta o banco (cuidado: apaga todos os dados)
```
