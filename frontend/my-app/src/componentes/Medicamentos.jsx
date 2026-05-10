import { Container, Card, Button, Col, Form, Row, Table, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function Medicamentos() {

  const [dados, setDados] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [bairro, setBairro] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [codigo, setCodigo] = useState("");
  const [qtdSuperior, setQtdSuperior] = useState("");
  const [qtdInferior, setQtdInferior] = useState("");

  const [loading, setLoading] = useState(false);

  const buscarDados = (pageNumber = 0) => {
    const url = buildUrl(pageNumber);
    setLoading(true);
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
  }, [])


  const buildUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (bairro.trim()) params.append("bairro", bairro.trim());
    if (medicamento.trim()) params.append("medicamento", medicamento.trim());
    if (codigo.trim()) params.append("codigo", codigo.trim());
    if (qtdSuperior.trim()) params.append("qtdSuperior", qtdSuperior.trim());
    if (qtdInferior.trim()) params.append("qtdInferior", qtdInferior.trim());
    params.append("page", pageNumber);
    params.append("size", 20);
    const query = params.toString();
    return `http://localhost:8080/medicamentos${query ? `?${query}` : ""}`;
  };

  const limparFiltros = () => {
    setBairro("");
    setMedicamento("");
    setCodigo("");
    setQtdSuperior("");
    setQtdInferior("");
  };

  const handleFiltrar = () => {
    buscarDados(0);
  };

  const handleLimpar = () => {
    limparFiltros();
    setLoading(true);
    fetch("http://localhost:8080/medicamentos?page=0&size=20")
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
            Estoque de Medicamentos
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
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                      value={bairro}
                      placeholder="Ex: Casa Amarela, Boa Vista..."
                      onChange={(e) => setBairro(e.target.value)} />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Medicamento</Form.Label>
                    <Form.Control
                      value={medicamento}
                      placeholder="Ex: Dipirona, Paracetamol..."
                      onChange={(e) => setMedicamento(e.target.value)} />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Código do Medicamento</Form.Label>
                    <Form.Control
                      value={codigo}
                      placeholder="Ex: 10943"
                      onChange={(e) => setCodigo(e.target.value)} />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Qtd. Superior - unit.</Form.Label>
                    <Form.Control
                      value={qtdSuperior}
                      placeholder="Ex: 30"
                      onChange={(e) => setQtdSuperior(e.target.value)} />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label>Qtd. Inferior - unit.</Form.Label>
                    <Form.Control
                      value={qtdInferior}
                      placeholder="Ex: 12"
                      onChange={(e) => setQtdInferior(e.target.value)} />
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
              <Table striped bordered hover responsive className="table-recife">
                <thead>
                  <tr>
                    <th>Distrito</th>
                    <th>Bairro</th>
                    <th>UFS</th>
                    <th>Tipo Produto</th>
                    <th>Medicamento</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        Nenhum medicamento encontrado.
                      </td>
                    </tr>
                  ) : loading && dados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  ) : dados.map((medicamento, idx) => (
                    <tr key={idx}>
                      <td>{medicamento.distrito}</td>
                      <td>{medicamento.bairro}</td>
                      <td>{medicamento.unidade}</td>
                      <td>{medicamento.tipoProduto}</td>
                      <td>{medicamento.produto}</td>
                      <td>{medicamento.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* 4. COMPONENTE DE PAGINAÇÃO */}
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