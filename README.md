# Painel de Monitoramento da Prefeitura do Recife (Desafio Técnico)

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura e Solução do Desafio](#-arquitetura-e-solução-do-desafio)
3. [Destaques Técnicos](#-destaques-técnicos)
4. [Como Executar o Projeto (Passo a Passo)](#-como-executar-o-projeto)
5. [Troubleshooting (Solução de Problemas)](#-troubleshooting)
6. [Base de Conhecimento (Handover)](#-base-de-conhecimento-handover-ia)

---

## Sobre o Projeto
Este projeto foi desenvolvido como parte de um desafio técnico para a vaga de **Desenvolvedor e Analista de Inovação**. A aplicação consiste em um sistema de monitoramento para a visualização, gestão e análise de dados públicos abertos disponibilizados pelo portal CKAN da Prefeitura do Recife.

O sistema processa e exibe informações sobre:
- Unidades de Saúde da Família (USF)
- Estoque de Medicamentos
- Unidades de Distribuição de Preservativos (UDP)
- Serviços de Apoio Diagnóstico e Terapêutico (SADT)
- Educação Infantil e Educação de Jovens e Adultos (EJA)

A interface conta com painéis analíticos utilizando gráficos interactivos e tabelas responsivas para exibição de dados com filtros ultra rápidos.

---

## Arquitetura e Solução do Desafio

O repositório está cirurgicamente dividido em duas camadas de alta coesão:

```text
📦 teste-desafio-tecnico-pref-recife
 ┣ 📂 backend-app  (Servidor Java / Spring Boot 4)
 ┗ 📂 frontend/my-app  (Aplicação React / Vite)
```

### O Desafio da API Pública (CKAN)
A API oficial da Prefeitura do Recife possui um limite "duro" de retornar no máximo 500 a 1000 registros por chamada. Como as bases são extremamente volumosas (ex: Medicamentos possui +40.000 linhas), isso inviabilizava a visualização correta e a agregação de dados.

### A Solução In-Memory (Cache Orquestrado)
Para contornar essa falha de infraestrutura externa, foi projetada uma solução de **Paginação com Cache em Memória**. Durante a inicialização, o Backend entra em um loop assíncrono manipulando o *offset* da API da prefeitura, realizando múltiplos downloads até esgotar a base de forma integral. A partir daí, toda a comunicação do Frontend é direcionada unicamente para o nosso Backend, garantindo paginação instantânea, dados completos e gráficos precisos.

---

## Destaques Técnicos

1. **Ordenação Global In-Memory:** Todas as tabelas possuem mecanismos de ordenação lógica (ex: Ordem Crescente de Estoque/Quantidade). Isso é processado de forma relâmpago pelas instâncias de `Java Streams` antes mesmo da paginação ser cortada.
2. **Filtros Dinâmicos (Anti-Duplicidade):** As opções de filtros na tela (como horários e bairros) nunca são estáticas. Elas usam a função `.distinct()` no servidor para varrer as bases originais e entregar um menu livre de nomes repetidos, evitando erros de digitação por parte do usuário.
3. **CORS Nativo:** Comunicação perfeitamente desobstruída entre as duas portas de desenvolvimento local.

---

## Como Executar o Projeto

Siga fielmente os 3 passos abaixo para ter a plataforma rodando na sua máquina em menos de dois minutos.

### Pré-requisitos
- **Java JDK 25** instalado.
- **Node.js (versão 18+)** instalado.
- O Git devidamente configurado.

### Passo 1: Clonar o repositório
```bash
git clone <url-do-seu-repositorio>
cd <pasta-do-projeto>
```

### Passo 2: Iniciar o Backend (Servidor de Dados)
> **ATENÇÃO:** O Backend deve ser o **PRIMEIRO** a ser iniciado, pois ele precisa de alguns segundos para realizar os milhares de downloads e montar o Cache local da Prefeitura do Recife na memória antes de liberar acesso às páginas web.

O projeto utiliza o Maven Wrapper embutido (`mvnw`), garantindo que não será necessária nenhuma instalação global.

1. Abra um terminal na pasta do backend:
   ```bash
   cd backend/backend-app
   ```
2. Compile e inicie o projeto executando os comandos a seguir. No Windows Powershell, não esqueça de usar o prefixo `.\` :
   ```bash
   .\mvnw clean install
   .\mvnw spring-boot:run
   ```
3. Aguarde o Spring Boot exibir no terminal os avisos de término de download (ex: `Cache de Medicamentos finalizado. Total de registros: 40392`). O seu servidor local estará pronto e rodando na porta `http://localhost:8080`. Mantenha este terminal aberto!

### Passo 3: Iniciar o Frontend (Interface Web)
Com o Backend já rodando em uma janela, prepare a tela visual:

1. Abra um **novo terminal** na pasta do frontend:
   ```bash
   cd frontend/my-app
   ```
2. Instale os pacotes e inicie a plataforma:
   ```bash
   npm install
   npm run dev
   ```
3. A aplicação estará ativa! Basta acessar no seu navegador o endereço padrão (geralmente **`http://localhost:5173`**) e navegar pelo seu painel de controle público!

---

## Troubleshooting

**Erro MAX_PATH do Windows ao extrair / clonar repositório:**
O Windows possui um limite histórico de 260 caracteres para o caminho completo de um arquivo, o que por vezes causa falhas durante a descompactação do Git. Nós encurtamos a nossa raiz Java para atenuar este problema nativamente, mas caso ocorra no seu terminal, siga estes passos:
1. Habilite caminhos longos: `git config --global core.longpaths true`
2. Restaure os arquivos ausentes na raiz: `git restore --source=HEAD :/`

---

## Base de Conhecimento (Handover IA)
Na raiz deste projeto você encontrará um arquivo essencial chamado **`AI_HANDOVER.md`**.
Sua leitura é obrigatória para futuros desenvolvedores ou agentes de Inteligência Artificial que forem atuar no código. Ele blinda as decisões arquiteturais da equipe (como o macete do `offset` na API do Recife) para que ninguém reescreva ou remova lógicas vitais do ecossistema e destrua a conectividade com a prefeitura sem querer.
