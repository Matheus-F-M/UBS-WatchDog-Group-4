### ----------------------------------------------------------------------------- #
### -------------------------Grupo 4 : UBS-WatchDog------------------------------ #
### ---------------------------- U B S  B R A N --------------------------------- #
### ----------------------------------------------------------------------------- #

Projeto do processo seletivo do programa de UBS Trainee IT Development. Projeto UBS WatchDog.

Link para os Requisitos do projeto:
https://dncgroupbr.notion.site/Projeto-Final-Integrador-2c91b4d4252c8004b834f9aa5f7ed851

# Objetivo: Criar um aplicativo que...
1. Mostre as informações de clientes, transações, e alertas do banco de dados
2. Adicionar, remover/desativar, e modificar informações de clientes da base de dados
3. Adicionar transações entre clientes
4. Disparar alertas para caso uma transação seja suspeita ou fraudolenta.

# --------------------------------------------------------------- #
# -------------------------# STACK #----------------------------- #
# --------------------------------------------------------------- #

## FRONTEND
- **Framework:** React 19.2.0
- **Linguagem:** TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Estilização:** Tailwind CSS 4.1.18
- **Componentes UI:** shadcn/ui + Radix UI
- **Roteamento:** React Router DOM 7.12.0
- **Gerenciamento de Estado:** Zustand 5.0.9
- **Validação:** Zod 4.3.5
- **Tabelas:** TanStack Table 8.21.3

## BACKEND
- **Framework:** ASP.NET Core (.NET 6.0/8.0)
- **Linguagem:** C#
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure, API)
- **Banco de Dados:** PostgreSQL (12+)
- **ORM:** Entity Framework Core
- **API Documentation:** Swagger/OpenAPI
- **Containerização:** Docker (opcional)

## ARQUITETURA
```
Frontend (React + TypeScript)
    ↓ HTTP/REST
Backend API (ASP.NET Core)
    ↓ EF Core
Database (PostgreSQL)
```

### Padrões Utilizados
- **Clean Architecture** - Separação em camadas (Domain, Application, Infrastructure, API)
- **Repository Pattern** - Abstração de acesso a dados
- **Dependency Injection** - Inversão de controle
- **RESTful API** - Comunicação cliente-servidor

# ----------------------------------------------------------------- #
# --------------------# RODANDO O SISTEMA #------------------------ #
# ----------------------------------------------------------------- #


## BACKEND
1. Entre em /backend/
2. Para iniciar o Banco de Dados, rode o comando no terminal:

```bash
    dotnet ef database update --project src/Bran.Infrastructure --startup-project src/Bran.API
```

--- OUTPUT ---
Build started...
Build succeeded.
Acquiring an exclusive lock for migration application. See https://aka.ms/efcore-docs-migrations-lock for more information if this takes too long.
No migrations were applied. The database is already up to date.
Done.

3. Entre em /backend/src/Bran.API/
4. Para iniciar os serviços e API, rode o comando no terminal:

```bash
    dotnet run
```

Você provavelmente irá receber textos te avisando de WARNINGS. Por exemplo:

--- OUTPUT ---
C:\...\UBS-WatchDog-Group-4\backend\src\Bran.Domain\Entities\User.cs(18,19): warning CS8618: Non-nullable property 'Username' must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring the property as nullable.
--------------

Esses Warnings não serão problema para o funcionamento do produto. Então, vamos ignora-los por agora.
O output mais importante é:

--- OUTPUT ---
Using launch settings from C:\...caminho...\UBS-WatchDog-Group-4\backend\src\Bran.API\Properties\launchSettings.json...
Building...
[21:19:57 INF] Now listening on: http://localhost:5131
[21:19:57 INF] Application started. Press Ctrl+C to shut down.
[21:19:57 INF] Hosting environment: Development
[21:19:57 INF] Content root path: C:\Users\Ti\Documents\GitHub\UBS-WatchDog-Group-4\backend\src\Bran.API
--------------

Isso significa que o servidor backend está funcionando!
Se você seguir o link ou abrir uma aba em um browser e digitar:
http://localhost:5131/swagger/index.html

Você terá acesso às funções API da UBS BRAN através do Swagger!
Com isso, o set up do Backend está concluído.

5. Inicie, agora, o FRONTEND

## FRONTEND
1. Entre em /frontend/react-app/
2. Rode o comando em seu terminal:

npm run dev

--- OUTPUT ---
> react-app@0.0.0 dev
> vite


  VITE v7.3.0  ready in 258 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
--------------

O seu programa frontend está rodando em http://localhost:5173/
Siga o link ou copie e cole esse endereço em algum browser que você já deve ser redirecionado(a/e) para a tela de login.

Com isso,
    Aproveite o UBS BRAN ! ! !