# UBS-WatchDog-Group-4
# UBS WatchDog Backend

## 📑 Visão Geral
O **UBS WatchDog** é um sistema backend para monitoramento de clientes, transações e alertas, com geração de relatórios.  
Ele foi construído em **camadas**, seguindo princípios de **Clean Architecture**, garantindo separação de responsabilidades e facilidade de manutenção.

---

## 🏛 Arquitetura

- **Domain**  
  Contém as entidades principais do sistema e os objetos de valor que representam conceitos específicos.  
  Também define as interfaces de repositórios, que descrevem como os dados podem ser acessados.

- **Application**  
  Contém os serviços que aplicam regras de negócio e lógica da aplicação.  
  Essa camada usa apenas as interfaces do domínio.

- **Infrastructure**  
  Implementa os repositórios concretos, usando Entity Framework Core para persistência em banco de dados.

- **API**  
  Exposição dos recursos via controllers REST.  
  Essa camada recebe requisições HTTP, chama os serviços da aplicação e retorna respostas em formato JSON.  
  Para evitar expor diretamente as entidades do domínio, utiliza DTOs (Data Transfer Objects).

---

## 📦 Entidades (Domain)

- `Client`
- `Transaction`
- `Alert`
- `Report`

---

## 📂 Value Objects (Domain)

- `ClientType`
- `ClientRiskLevel`
- `KycStatus`

---

## 📂 Interfaces de Repositórios (Domain.Interfaces)

- `IClientsRepository`
- `ITransactionsRepository`
- `IAlertsRepository`

---

## ⚙️ Serviços (Application)

- `ClientService`
- `ReportService`

---

## 📊 DTOs (API.DTOs)

- `ClientResponse`
- `ReportResponse`

---

## 🌐 Controllers (API.Controllers)

- `ClientsController`
- `ReportsController`

---

## 📂 Infrastructure

- Implementações concretas dos repositórios:
  - `IClientsRepository`
  - `ITransactionsRepository`
  - `IAlertsRepository`

---

## 🚀 Fluxo de Uso

1. **Cadastro de Cliente** → via `ClientsController`.  
2. **Registro de Transações e Alertas** → via repositórios.  
3. **Geração de Relatórios** → via `ReportService`.  
4. **Resposta da API** → via DTOs (`ClientResponse`, `ReportResponse`).

---

## 📌 Conclusão
O backend do UBS WatchDog está organizado em camadas, garantindo separação clara entre **domínio, aplicação, infraestrutura e API**.  
Os **DTOs** asseguram que apenas os dados necessários sejam expostos.  
Os **controllers** seguem boas práticas REST, e os **serviços** encapsulam toda a lógica de negócio.  
A lista completa de classes e interfaces garante rastreabilidade e clareza sobre os componentes existentes no sistema.

