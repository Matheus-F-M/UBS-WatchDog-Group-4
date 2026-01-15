
# Grupo 4 : UBS-WatchDog
# U B S  B R A N

Projeto do processo seletivo do programa de UBS Trainee IT Development. Projeto UBS WatchDog.

Link para os Requisitos do projeto:
https://dncgroupbr.notion.site/Projeto-Final-Integrador-2c91b4d4252c8004b834f9aa5f7ed851

### Objetivo: Criar um aplicativo que...
1. Mostre as informações de clientes, transações, e alertas do banco de dados
2. Adicionar, remover/desativar, e modificar informações de clientes da base de dados
3. Adicionar transações entre clientes
4. Disparar alertas para caso uma transação seja suspeita ou fraudolenta.


### STACK

##### FRONTEND
- **Framework:** React 19.2.0
- **Linguagem:** TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Estilização:** Tailwind CSS 4.1.18
- **Componentes UI:** shadcn/ui + Radix UI
- **Roteamento:** React Router DOM 7.12.0
- **Gerenciamento de Estado:** Zustand 5.0.9
- **Validação:** Zod 4.3.5
- **Tabelas:** TanStack Table 8.21.3

##### BACKEND
- **Framework:** ASP.NET Core (.NET 6.0/8.0)
- **Linguagem:** C#
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure, API)
- **Banco de Dados:** PostgreSQL (12+)
- **ORM:** Entity Framework Core
- **API Documentation:** Swagger/OpenAPI
- **Containerização:** Docker (opcional)

##### ARQUITETURA
```
Frontend (React + TypeScript)
    ↓ HTTP/REST
Backend API (ASP.NET Core)
    ↓ EF Core
Database (PostgreSQL)
```

###### Padrões Utilizados
- **Clean Architecture** - Separação em camadas (Domain, Application, Infrastructure, API)
- **Repository Pattern** - Abstração de acesso a dados
- **Dependency Injection** - Inversão de controle
- **RESTful API** - Comunicação cliente-servidor


### RODANDO O SISTEMA

##### BACKEND
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

##### FRONTEND
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

### Testes e Usando o Aplicativo
##### Log In e Registrar
Logo de inicio, você têm a opção de entrar com um usuário ou registar uma nova conta.
Como esse programa usa localStorage para registrar as autenticações, apenas não inclua informações sensíveis nessas credenciais como senhas que você usa em outros lugares ou registros de outras contas.

##### Home
Ao registrar uma "mock account", você está no Home do UBS BRAN.
Você pode Sign Out para sair da sua sessão e voltar para a tela de login. Além disso, você pode Delete Account, que irá deletar as suas credenciais do seu local storage. Caso você queira re-acessar o aplicativo, você precisará regitrar uma nova conta ou usar outra conta que não foi deletada. 
Aqui você navegar pelos serviços do aplicativo pela barra de navegação ao topo ou pelos botões redondos.
Descrições sobre os serviços são concedidas por dropboxes abaixo.

##### Clientes
Na Tela de Clientes você pode acessar todas as informações de todos os clientes do banco de dados. Além disso, você pode usar filtros para simplificar a tabela ou procurar por clientes específicos. Adicionalmente, pode adicionar ou remover clientes do banco de dados. Ao remover um cliente, você na verdade está desativando a conta dele(a/u).
Finalmente, ao clicar em "Ver Relatório", a página de relatório daquele cliente será aberta.

###### Relatório
Aqui você pode ver e editar informações de clientes, além de identificar quantas transações e alertas aquele cliente fez e tem. Quanto maior a razão entre a quantidade de alertas e quantidade de transações, menor é o grau de confiança de um cliente. O grau de confiança vai de -100% à 100%.

##### Tela de Transações
Aqui você pode ver e filtrar transações, similarmente como na tela de clientes.
Além disso, você pode adicionar transações. Repare que transações que quebrem regras de compliance geram alertas que podem ser vistos na tela de alertas.
Você também pode acessar as informações da Parte e Contraparte apenas clicando em seu nome ou CPF/CNPJ, abrindo assim telas de Relatório.

##### Tela de Alertas
Finalmente, aqui na tela de alertas você pode visualizar e filtrar alertas disparados. A única coisa que pode ser alterada em um alerta é seu status.

### Menções Finais
Como o grupo UBS BRAN foi reduzido pela metade, nosso planejamento foi impactado, o que nos fez perder duas semanas de progresso e discussões. Portanto, essa versão inicial do UBS BRAN ainda carece de algumas propriedades.
Por exemplo, por enquanto não é possível mudar regras de compliance e talvez você encontre pequenos erros ao alterar alguma informação.
Mesmo assim, o time UBS BRAN trabalhou ardualmente para criar o melhor aplicativo que era possível ser criado com a metade do tempo que foi nos dado inicialmente e a metade do grupo que existia no começo. Acreditamos no potêncial técnico e de marketing do UBS BRAN, e esperamos que você concorde conosco!

Muito Obrigado pela oportunidade de trabalhar nesse aplicativo.

Sinceramente,
    Aproveite o UBS BRAN ! ! !