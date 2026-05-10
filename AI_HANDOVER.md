# AI Handover Context & Project Documentation
*(Documento de Base de Conhecimento para a Próxima Interação com IA)*

Este documento visa preservar o contexto técnico, as decisões arquiteturais e as convenções rigorosas de código estabelecidas durante o desenvolvimento do **Painel de Monitoramento da Prefeitura do Recife**. Qualquer agente de Inteligência Artificial que continuar este projeto DEVE ler e seguir este documento integralmente.

---

## 1. Regras do Projeto e Convenções Absolutas
Para manter o padrão do projeto, o agente de IA **deverá:**
- **NÃO utilizar emojis** em documentações técnicas ou mensagens (`README.md`, commits, comentários).
- **Preservar a Stack Atual:** Frontend construído com **React 19**, **Vite** e **Bootstrap/React-Bootstrap** (Vanilla CSS). O uso de frameworks utilitários como TailwindCSS não foi utilizado e é estritamente desencorajado para não misturar padrões. O Backend roda em **Java 25**, **Spring Boot 4.0.6**.
- **Preservar o código existente:** Não exclua ou substitua arquivos existentes sem realizar verificações prévias de alto nível do impacto (apenas estender funções).

---

## 2. O Maior Desafio Técnico: O Limite Invisível do CKAN

### O Problema da API Pública
Ao consumir os portais de dados abertos do Recife (CKAN), identificamos que o parâmetro padrão de `limit` possui um bloqueio rígido (hard-cap) no servidor do lado da prefeitura. Se enviarmos uma chamada pedindo `limit=1000` (ou `40000`), o servidor responderá forçosamente limitando o payload a **exatos 500 registros** e ignorando o restante da solicitação. Isso causava falhas graves no Frontend, exibindo apenas as 500 primeiras linhas de uma tabela com 40.000 (ex: Medicamentos), quebrando a paginação original e todas as métricas agregadas dos gráficos.

### A Solução Orquestrada (O Segredo do Backend)
A solução adotada foi **inverter a paginação**. Criamos um **Cache em Memória (RAM)** dentro do Backend.
O fluxo funciona assim:
1. Ao iniciar o servidor (`@PostConstruct`), o Spring Boot roda uma rotina assíncrona de Fetch iterativo nas APIs da Prefeitura do Recife (`RecifeMedicamentoApiClient.java`, etc.).
2. Em vez de avançar o offset usando o `limit` estático (o que quebrava o loop por conta do cap da API), a paginação agora avança baseada no retorno real do servidor: `offset += lote.size();`.
3. A condição de parada do loop passou a ser **`if (lote.isEmpty()) { temMais = false; }`**. Assim, garantimos que ele continuará puxando de 500 em 500 até realmente esgotar a fonte (baixando os 40.000 itens).
4. Todas as listas imutáveis são mantidas nos arquivos `Service` do backend em memória durante o runtime.

### Aviso Importante para Futuros Agentes
> **NUNCA** modifique as linhas `offset += lote.size();` e `if (lote.isEmpty())` dos Services (`MedicamentoService`, `UsfService`, `SadtService`, `UdpService`, `EducacaoInfantilEjaService`). Elas são o coração que burla o rate-limit do CKAN. Mudá-las destruirá o carregamento de dados do sistema.

---

## 3. Padrão de Design do Frontend

1. **DTO `PaginaResponse<T>`:** Toda a comunicação de tabelas com o backend passa obrigatoriamente a ser envolvida por este DTO genérico.
2. **Listagens React (Componentes):**
   - Utilizamos paginação instantânea puramente local, já que o backend devolve fatias exatas do que está em memória (`?page=x&size=20`).
   - Foram instalados botões funcionais ("Próxima" e "Anterior") utilizando o controle do estado local via `useState(0)` em todos os 5 componentes de tela.
   - Um feedback visual `<Spinner />` foi mantido durante as atualizações dos filtros para uma melhor UX.
3. **Dashboard Analítico (`Painel.jsx`):**
   - Utiliza as melhores práticas de Data Visualization.
   - Diferente das tabelas (que usam size=20), o Painel foi codificado para efetuar requisições requisitando `size=100000`. Isso garante que o cache venha em sua totalidade (40.000+) permitindo as operações de `.reduce` processarem fidedignamente o montante de agrupamentos.
   - O objeto visual **Chart.js** foi injetado via `<script>` para não sujar o empacotamento com dependências diretas. Usamos Barras e Roscas (Doughnut) aplicando Cores dinâmicas e limpas e filtros como "Top 10", tudo para evitar poluição visual de categorias em massa.

---

## 4. Onde Continuar

Caso seja necessário dar andamento nas rotinas de código:
1. Todos os controllers do Spring Boot suportam nativamente `page`, `size` e uma gama de parâmetros de filtro opcionais que combinam com as colunas.
2. Nenhuma alteração disruptiva foi feita no estilo geral CSS (padrão mantido). Use o `react-bootstrap` para estender novas interfaces.
3. Este projeto está validado, altamente funcional e construído no mais estrito padrão de design corporativo. Leia este arquivo de handover primeiro antes de refatorar qualquer lógica descrita acima.
