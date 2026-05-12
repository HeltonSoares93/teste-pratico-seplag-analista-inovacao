import { Container, Card, Button, Col, Form, Row, Table, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function EducacaoInfantilEja() {


  const [dados, setDados] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [unidadeEnsino, setUnidadeEnsino] = useState("")
  const [bairroEscola, setBairroEscola] = useState("")
  const [modalidadeEnsino, setModalidadeEnsino] = useState("")
  const [sexo, setSexo] = useState("")
  const [raca, setRaca] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [ordem, setOrdem] = useState("")

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
  }, []);

  const buildUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (unidadeEnsino.trim()) params.append("unidadeEnsino", unidadeEnsino.trim());
    if (bairroEscola.trim()) params.append("bairroEscola", bairroEscola.trim());
    if (modalidadeEnsino.trim()) params.append("modalidadeEnsino", modalidadeEnsino.trim());
    if (sexo.trim()) params.append("sexo", sexo.trim());
    if (raca.trim()) params.append("raca", raca.trim());
    if (quantidade.trim()) params.append("quantidade", quantidade.trim());
    if (ordem.trim()) params.append("ordem", ordem.trim());
    params.append("page", pageNumber);
    params.append("size", 20);
    const query = params.toString();
    return `http://localhost:8080/dados-educacao-infantil-eja${query ? `?${query}` : ""}`;
  };

  const limparFiltros = () => {
    setUnidadeEnsino("");
    setBairroEscola("");
    setModalidadeEnsino("");
    setSexo("");
    setRaca("");
    setQuantidade("");
    setOrdem("");
  };

  const handleFiltrar = () => {
    buscarDados(0);
  };

  const handleLimpar = () => {
    limparFiltros();
    setLoading(true);
    fetch("http://localhost:8080/dados-educacao-infantil-eja?page=0&size=20")
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
            Demanda na Educação Infantil (0 a 3 anos) e de Jovens e Adultos (EJA)
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
                    <Form.Control placeholder="Nome da unidade de ensino..."
                      value={unidadeEnsino}
                      onChange={(e) => setUnidadeEnsino(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control placeholder="Ex: Casa Amarela, Boa Vista..."
                      value={bairroEscola}
                      onChange={(e) => setBairroEscola(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Sexo</Form.Label>
                    <Form.Select 
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      <option value="">Todos os sexos</option>
                      <option value="F">Feminino</option>
                      <option value="M">Masculino</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Ordenação (Qtd)</Form.Label>
                    <Form.Select 
                      value={ordem}
                      onChange={(e) => setOrdem(e.target.value)}
                    >
                      <option value="">Padrão</option>
                      <option value="asc">Crescente (Menor para Maior)</option>
                      <option value="desc">Decrescente (Maior para Menor)</option>
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
                    <th>Unidade de Ensino</th>
                    <th>Bairro</th>
                    <th>Modalidade</th>
                    <th>Sexo</th>
                    <th>Raça</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">Nenhum dado encontrado.</td>
                    </tr>
                  ) : loading && dados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4"><Spinner animation="border" variant="primary" /></td>
                    </tr>
                  ) : dados.map((unidade, index) => (
                    <tr key={index}>
                      <td>{unidade.unidadeEnsino}</td>
                      <td>{unidade.bairroEscola}</td>
                      <td>{unidade.modalidadeEnsino}</td>
                      <td>{unidade.sexo}</td>
                      <td>{unidade.raca}</td>
                      <td>{unidade.quantidade}</td>
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