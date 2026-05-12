import { Container, Card, Button, Col, Form, Row, Table, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function UnidadesSaudeDaFamilia() {

  const [dados, setDados] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [nomeOficial, setNomeOficial] = useState("")
  const [bairro, setBairro] = useState("")
  const [endereco, setEndereco] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [horario, setHorario] = useState("")
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const [loading, setLoading] = useState(false);

  // Buscar dados na API
  const buscarDados = (pageNumber = 0) => {
    const url = buildUrl(pageNumber);
    setLoading(true)
    fetch(url)
      .then(resposta => {
        if (!resposta.ok) {
          throw new Error("Não foi possível buscar os dados no momento, tente novamente.")
        }
        return resposta.json();
      })
      .then(json => {
        setDados(json.dados || []);
        setCurrentPage(json.pagina || 0);
        setTotalPages(json.totalPaginas || 1);
      }).catch(erro => {
        console.error("Erro na comunicação com a API: ", erro);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDados(0);
    fetch("http://localhost:8080/usf/horarios")
      .then(res => res.json())
      .then(json => setHorariosDisponiveis(json || []))
      .catch(erro => console.error("Erro ao buscar horários: ", erro));
  }, []);

  const buildUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (nomeOficial.trim()) params.append("nomeOficial", nomeOficial.trim());
    if (endereco.trim()) params.append("endereco", endereco.trim());
    if (especialidade.trim()) params.append("especialidade", especialidade.trim());
    if (bairro.trim()) params.append("bairro", bairro.trim());
    if (horario.trim()) params.append("horario", horario.trim());
    params.append("page", pageNumber);
    params.append("size", 20);
    const query = params.toString();
    return `http://localhost:8080/usf${query ? `?${query}` : ""}`;
  };

  const limparFiltros = () => {
    setBairro("");
    setNomeOficial("");
    setEndereco("");
    setEspecialidade("");
    setHorario("")
  };

  const handleFiltrar = () => {
    buscarDados(0);
  };

  const handleLimpar = () => {
    limparFiltros();
    setLoading(true);
    fetch("http://localhost:8080/usf?page=0&size=20")
      .then(res => res.json())
      .then(json => {
        setDados(json.dados || []);
        setCurrentPage(0);
        setTotalPages(json.totalPaginas || 1);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <Card>

        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <h2 className="mb-0 text-center text-md-start">
            Unidades de Saúde da Família
          </h2>
        </Card.Header>
        <Card.Body className="mb-3">
          <Card>
            <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 bg-white">
              <h4 className="mb-0 text-center text-md-start">Definir Parâmetros de Consulta</h4>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Button variant="success" className="text-white" onClick={handleFiltrar} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Filtrar"}
                </Button>
                <Button variant="info" className="text-white" onClick={handleLimpar} disabled={loading}>Limpar</Button>
              </div>
            </Card.Header>

            <Card.Body>
              <Form>
                <Row className="g-3">
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Nome da Unidade</Form.Label>
                    <Form.Control placeholder="Ex: Psf Coelhos..."
                      value={nomeOficial}
                      onChange={(e) => setNomeOficial(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control placeholder="Ex: Casa Amarela, Boa Vista..."
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Especialidade</Form.Label>
                    <Form.Control placeholder="Ex: Clínico geral, enfermangem..."
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control placeholder="Ex: Av Conde da Boa Vista..."
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Horário</Form.Label>
                    <Form.Select 
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                    >
                      <option value="">Todos os horários</option>
                      {horariosDisponiveis.map((h, i) => (
                        <option key={i} value={h}>{h}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Body>
              {/* <div className="d-flex flex-wrap justify-content-center justify-content-md-end mb-3 gap-2">
                <Button variant="danger" className="d-flex align-items-center gap-2">
                  Exportar PDF
                </Button>

                <Button variant="success" className="d-flex align-items-center gap-2">
                  Exportar Planilha
                </Button>
              </div> */}
              <Table striped bordered hover className="table-recife" responsive>
                <thead>
                  <tr>
                    <th>Nome da Unidade</th>
                    <th>Bairro</th>
                    <th>Especialidade</th>
                    <th>Endereço</th>
                    <th>Horário</th>
                    <th>Contato</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">Nenhuma USF encontrada.</td>
                    </tr>
                  ) : loading && dados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4"><Spinner animation="border" variant="primary" /></td>
                    </tr>
                  ) : dados.map((unidade, idx) => (
                    <tr key={idx}>
                      <td>{unidade.nomeOficial}</td>
                      <td>{unidade.bairro}</td>
                      <td>{unidade.especialidade}</td>
                      <td>{unidade.endereco}</td>
                      <td>{unidade.horario}</td>
                      <td>{unidade.fone}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                  <Button 
                    variant="outline-primary" 
                    disabled={currentPage === 0 || loading} 
                    onClick={() => buscarDados(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-secondary fw-semibold">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <Button 
                    variant="outline-primary" 
                    disabled={currentPage >= totalPages - 1 || loading} 
                    onClick={() => buscarDados(currentPage + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  )
}