# Painel de Monitoramento da Prefeitura do Recife (Desafio Técnico)

## Sobre o Projeto
Este projeto foi desenvolvido como parte de um desafio técnico para a vaga de Desenvolvedor e Analista de Inovação. A aplicacação consiste em um sistema de monitoramento para a visualização, gestão e análise de dados públicos abertos disponibilizados pelo portal CKAN da Prefeitura do Recife.

O sistema processa informações sobre:
- Unidades de Saúde da Família (USF)
- Estoque de Medicamentos
- Unidades de Distribuição de Preservativos (UDP)
- Serviços de Apoio Diagnóstico e Terapêutico (SADT)
- Educação Infantil e Educação de Jovens e Adultos (EJA)

A interface conta com painéis analíticos utilizando gráficos (Chart.js) e tabelas responsivas para exibição filtrada dos dados.

## Arquitetura
O sistema foi estruturado em duas camadas principais:

1. **Backend (API Rest):** Construído com Java e Spring Boot. Atua como um orquestrador e sistema de cache. Ele consome a API oficial do Recife, processa os dados e serve endpoints otimizados para o cliente.
2. **Frontend (SPA):** Construído com React e Vite. Interface reativa com componentes modulares (React Bootstrap) e renderização client-side das tabelas e gráficos analíticos.

## O Desafio: Limitação de Requisições do CKAN

### O Problema
A API oficial da Prefeitura do Recife (baseada em CKAN) possui um limite "duro" de retornar no máximo 500 a 1000 registros por chamada de rede. Como as bases de dados são extremamente volumosas (ex: a base de medicamentos possui mais de 40.000 linhas), a aplicação Frontend recebia dados truncados. Isso impedia a visualização completa nas tabelas e inviabilizava a criação de gráficos com métricas fieis à realidade para o Dashboard.

### A Solução Orquestrada por IA
Para contornar esse desafio técnico de infraestrutura da API pública, **este projeto contou com a utilização de um agente de Inteligência Artificial** que operou por meio de orquestração de comandos e planejamento, sempre prezando por um código limpo e padronizado.

A solução desenhada em conjunto foi a de **Paginação com Cache em Memória no Backend**.
Durante a inicialização do servidor Spring Boot (`@PostConstruct`), o Backend faz dezenas de requisições iterativas controlando os parâmetros nativos do CKAN (limite e offset). A IA inclusive detectou e corrigiu um comportamento oculto do CKAN (que retornava lotes máximos de 500 itens, encerrando loops prematuramente). Com o avanço dinâmico do `offset`, o Backend realiza o download 100% integral de todas as bases.

A partir de então, os dados ficam armazenados na memória da aplicação (RAM) utilizando coleções imutáveis e otimizadas. O Frontend passa a se comunicar apenas com o nosso Backend, que expõe os dados em um DTO genérico `PaginaResponse` contendo paginação própria e instantânea (`page` e `size`). Isso tornou a navegação fluida, os filtros ultrarrápidos e as métricas dos gráficos estritamente corretas.

## Base de Conhecimento (Handover IA)
Na raiz deste projeto você encontrará um arquivo essencial chamado **`AI_HANDOVER.md`**.
Ele foi concebido como uma **"memória estática" (Longo Prazo)** para garantir que o projeto seja completamente escalável e seguro de se manter. Seu objetivo é guiar qualquer futuro agente de Inteligência Artificial ou desenvolvedor humano sobre as regras de arquitetura rígidas, os macetes e soluções de limite da API utilizados (a matemática do `offset` do CKAN) e as convenções que devem ser mantidas (Stack React Vanilla + Java). Ele blinda o repositório contra alucinações de IAs futuras e preserva a genialidade do código desenhado.

## Ferramentas Necessárias
Para rodar este projeto, você precisará ter instalado em sua máquina:
- Java JDK 25
- Maven (ou utilizar o Wrapper embutido)
- Node.js (versão 18 ou superior)
- Git

## Versões e Bibliotecas Utilizadas

**Backend:**
- Java 25
- Spring Boot 4.0.6
- Spring Boot Web MVC
- Lombok
- H2 Database (Banco de dados em memória)

**Frontend:**
- React 19.2.5
- Vite 8.0.10
- React Bootstrap 2.10.10 (com Bootstrap 5.3.8)
- React Router Dom 7.15.0
- Chart.js (via CDN nativo)

## Como Executar o Projeto

Siga os passos abaixo para clonar e rodar a aplicação em seu ambiente local.

### 1. Clonar o Repositório
Abra o seu terminal e execute:
```bash
git clone <url-do-seu-repositorio>
cd <pasta-do-projeto>
```

### 2. Executar o Backend
Abra um terminal na pasta do Backend:
```bash
cd backend/backend-teste-pratico-vaga-analista-de-inovacao
```
Realize a compilação e execute o projeto (usando o Maven Wrapper local ou a sua instalação do Maven):
```bash
mvn clean install
mvn spring-boot:run
```
Aguarde alguns segundos até que o Spring Boot exiba a mensagem informando que finalizou a extração e o cache de todas as linhas de dados do CKAN. O Backend ficará disponível em `http://localhost:8080`.

### 3. Executar o Frontend
Abra um novo terminal na raiz do projeto e navegue até a pasta do Frontend:
```bash
cd frontend/my-app
```
Instale as dependências:
```bash
npm install
```
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
A aplicação abrirá no seu navegador (geralmente em `http://localhost:5173`). Navegue pelos menus para visualizar as tabelas paginadas e os painéis gráficos populados com os dados da API.
