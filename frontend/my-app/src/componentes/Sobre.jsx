export default function Sobre() {

  return (
    <div className="container py-5">
      {/* Cabeçalho */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold text-primary mb-3">Sobre o Projeto</h1>
          <p className="lead text-muted">
            Solução tecnológica desenvolvida para o desafio prático da vaga de <strong>Analista de Inovação</strong> da Secretaria de Planejamento e Gestão (Prefeitura do Recife).
          </p>
        </div>
      </div>

      {/* Seção: O Desafio */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="h3 text-dark mb-4">
                <i className="bi bi-bullseye text-primary me-2"></i> O Desafio e a Solução
              </h2>
              <p>
                Alinhado com as iniciativas de GovTech e cidade inteligente, o projeto foca no eixo da <strong>Saúde Pública</strong>. O sistema conecta-se ativamente à API do Portal de Dados Abertos da Cidade do Recife (plataforma CKAN) para extrair, tratar e visualizar informações sobre a infraestrutura das Unidades de Saúde da Família (USFs).
              </p>
              <p className="mb-0">
                O resultado é um painel analítico que transforma dados brutos e complexos em informações claras, organizadas e filtráveis, simulando um cenário real de monitoramento para apoiar gestores públicos e cidadãos na tomada de decisão estratégica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Arquitetura (Grid Dividido) */}
      <div className="row mb-5 g-4">
        <div className="col-12 mb-3">
          <h2 className="h3 text-dark text-center">Arquitetura Técnica (BFF)</h2>
          <p className="text-center text-muted">Separação de responsabilidades para garantir resiliência e escalabilidade.</p>
        </div>

        {/* Card Backend */}
        <div className="col-md-6">
          <div className="card border-top-0 border-end-0 border-bottom-0 border-primary border-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="h5 text-primary fw-bold">Backend (Java + Spring Boot)</h3>
              <p className="card-text mt-3">
                Atua como a camada de integração (BFF). É responsável por consumir a API governamental externa via <code>RestClient</code> e aplicar camadas de cache.
              </p>
              <ul className="text-muted">
                <li>Isolamento de falhas externas.</li>
                <li>Tratamento e sanitização de DTOs.</li>
                <li>Redução de carga na rede.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card Frontend */}
        <div className="col-md-6">
          <div className="card border-top-0 border-end-0 border-bottom-0 border-success border-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="h5 text-success fw-bold">Frontend (React + Bootstrap)</h3>
              <p className="card-text mt-3">
                Uma <em>Single Page Application</em> (SPA) responsiva focada na experiência do usuário (UX).
              </p>
              <ul className="text-muted">
                <li>Renderização rápida de componentes.</li>
                <li>Tabelas de dados dinâmicas.</li>
                <li>Design system corporativo e acessível.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé da página sobre */}
      <div className="row text-center mt-5">
        <div className="col-12">
          <p className="text-muted small">
            Fonte dos dados: <a href="https://dados.recife.pe.gov.br/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">Portal de Dados Abertos do Recife</a>.
          </p>
        </div>
      </div>
    </div>
  )
}