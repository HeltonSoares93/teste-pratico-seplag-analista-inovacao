import { Container, Card, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

export default function Painel() {
  const [usfData, setUsfData] = useState([]);
  const [medicamentosData, setMedicamentosData] = useState([]);
  const [udpData, setUdpData] = useState([]);
  const [sadtData, setSadtData] = useState([]);
  const [educacaoData, setEducacaoData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);
  const chartRefs = useRef({});

  const fetchAll = (url) => fetch(url).then(res => res.ok ? res.json() : {}).then(json => json.dados || []);

  const buscarDados = () => {
    setLoading(true);
    Promise.all([
      fetchAll("http://localhost:8080/usf?size=100000"),
      fetchAll("http://localhost:8080/medicamentos?size=100000"),
      fetchAll("http://localhost:8080/udp?size=100000"),
      fetchAll("http://localhost:8080/sadt?size=100000"),
      fetchAll("http://localhost:8080/dados-educacao-infantil-eja?size=100000")
    ])
      .then(([usf, med, udp, sadt, educacao]) => {
        setUsfData(usf);
        setMedicamentosData(med);
        setUdpData(udp);
        setSadtData(sadt);
        setEducacaoData(educacao);
      })
      .catch(erro => {
        console.error("Erro na comunicação com a API: ", erro);
        alert("Falha ao carregar os dados. Verifique se o backend está rodando na porta 8080.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => {
      setChartLoaded(true);
      buscarDados();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      Object.values(chartRefs.current).forEach(chart => chart && chart.destroy());
    };
  }, []);

  useEffect(() => {
    if (!loading && chartLoaded && usfData && medicamentosData && educacaoData) {
      setTimeout(() => {
        renderCharts(usfData, medicamentosData, educacaoData);
      }, 50);
    }
  }, [loading, chartLoaded, usfData, medicamentosData, educacaoData]);

  const renderCharts = (usf, med, educacao) => {
    if (!window.Chart) return;

    // --- GRÁFICOS DE SAÚDE ---
    const rpaCounts = usf.reduce((acc, curr) => {
      const rpa = curr.rpa || "N/I";
      acc[rpa] = (acc[rpa] || 0) + 1;
      return acc;
    }, {});

    const ctxBar = document.getElementById("chartUsfRpa");
    if (ctxBar) {
      if (chartRefs.current["chartUsfRpa"]) chartRefs.current["chartUsfRpa"].destroy();
      chartRefs.current["chartUsfRpa"] = new window.Chart(ctxBar, {
        type: "bar",
        data: {
          labels: Object.keys(rpaCounts).map(r => r === "N/I" ? "Não Informado" : `RPA ${r}`),
          datasets: [{
            label: "Quantidade de USFs",
            data: Object.values(rpaCounts),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Distribuição de USFs por Região (RPA)", font: { size: 16 } }
          }
        }
      });
    }

    const tipoMedCounts = med.reduce((acc, curr) => {
      const tipo = curr.tipoProduto || "Outros";
      acc[tipo] = (acc[tipo] || 0) + (curr.quantidade || 1);
      return acc;
    }, {});

    const ctxDoughnut = document.getElementById("chartMedTipo");
    if (ctxDoughnut) {
      if (chartRefs.current["chartMedTipo"]) chartRefs.current["chartMedTipo"].destroy();
      chartRefs.current["chartMedTipo"] = new window.Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
          labels: Object.keys(tipoMedCounts),
          datasets: [{
            data: Object.values(tipoMedCounts),
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)", "rgba(99, 102, 241, 0.8)", "rgba(139, 92, 246, 0.8)"
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Estoque de Medicamentos por Tipo", font: { size: 16 } }
          }
        }
      });
    }

    // Top 10 Medicamentos
    const medQuantities = med.reduce((acc, curr) => {
      const nome = curr.produto || "Desconhecido";
      acc[nome] = (acc[nome] || 0) + (curr.quantidade || 0);
      return acc;
    }, {});
    
    const top10Med = Object.entries(medQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const ctxMedTop = document.getElementById("chartMedTop10");
    if (ctxMedTop) {
      if (chartRefs.current["chartMedTop10"]) chartRefs.current["chartMedTop10"].destroy();
      chartRefs.current["chartMedTop10"] = new window.Chart(ctxMedTop, {
        type: "bar",
        data: {
          labels: top10Med.map(item => item[0].substring(0, 20) + (item[0].length > 20 ? "..." : "")),
          datasets: [{
            label: "Quantidade em Estoque",
            data: top10Med.map(item => item[1]),
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y', // horizontal bar
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Top 10 Medicamentos em Maior Quantidade", font: { size: 16 } }
          }
        }
      });
    }

    const bottom10Med = Object.entries(medQuantities)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10);

    const ctxMedBottom = document.getElementById("chartMedBottom10");
    if (ctxMedBottom) {
      if (chartRefs.current["chartMedBottom10"]) chartRefs.current["chartMedBottom10"].destroy();
      chartRefs.current["chartMedBottom10"] = new window.Chart(ctxMedBottom, {
        type: "bar",
        data: {
          labels: bottom10Med.map(item => item[0].substring(0, 20) + (item[0].length > 20 ? "..." : "")),
          datasets: [{
            label: "Quantidade em Estoque",
            data: bottom10Med.map(item => item[1]),
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y', // horizontal bar
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Top 10 Medicamentos em Menor Quantidade", font: { size: 16 } }
          }
        }
      });
    }


    // --- GRÁFICOS DE EDUCAÇÃO ---
    // Educação - Sexo
    const sexoCounts = educacao.reduce((acc, curr) => {
      const s = curr.sexo || "N/I";
      acc[s] = (acc[s] || 0) + (curr.quantidade || 0);
      return acc;
    }, {});

    const ctxEduSexo = document.getElementById("chartEduSexo");
    if (ctxEduSexo) {
      if (chartRefs.current["chartEduSexo"]) chartRefs.current["chartEduSexo"].destroy();
      chartRefs.current["chartEduSexo"] = new window.Chart(ctxEduSexo, {
        type: "doughnut",
        data: {
          labels: Object.keys(sexoCounts).map(k => k === 'M' ? 'Masculino' : (k === 'F' ? 'Feminino' : k)),
          datasets: [{
            data: Object.values(sexoCounts),
            backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(236, 72, 153, 0.8)", "rgba(156, 163, 175, 0.8)"],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Alunos por Sexo", font: { size: 16 } }
          }
        }
      });
    }

    // Educação - Raça
    const racaCounts = educacao.reduce((acc, curr) => {
      const r = curr.raca || "N/I";
      acc[r] = (acc[r] || 0) + (curr.quantidade || 0);
      return acc;
    }, {});

    const ctxEduRaca = document.getElementById("chartEduRaca");
    if (ctxEduRaca) {
      if (chartRefs.current["chartEduRaca"]) chartRefs.current["chartEduRaca"].destroy();
      chartRefs.current["chartEduRaca"] = new window.Chart(ctxEduRaca, {
        type: "doughnut",
        data: {
          labels: Object.keys(racaCounts),
          datasets: [{
            data: Object.values(racaCounts),
            backgroundColor: [
              "rgba(245, 158, 11, 0.8)", "rgba(16, 185, 129, 0.8)", 
              "rgba(99, 102, 241, 0.8)", "rgba(139, 92, 246, 0.8)", 
              "rgba(239, 68, 68, 0.8)", "rgba(156, 163, 175, 0.8)"
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Alunos por Raça", font: { size: 16 } }
          }
        }
      });
    }

    // Educação - Top 10 Bairros
    const bairroCounts = educacao.reduce((acc, curr) => {
      const b = curr.bairroEscola || "N/I";
      acc[b] = (acc[b] || 0) + (curr.quantidade || 0);
      return acc;
    }, {});

    const top10Bairros = Object.entries(bairroCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const ctxEduBairro = document.getElementById("chartEduBairro");
    if (ctxEduBairro) {
      if (chartRefs.current["chartEduBairro"]) chartRefs.current["chartEduBairro"].destroy();
      chartRefs.current["chartEduBairro"] = new window.Chart(ctxEduBairro, {
        type: "bar",
        data: {
          labels: top10Bairros.map(item => item[0]),
          datasets: [{
            label: "Alunos",
            data: top10Bairros.map(item => item[1]),
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderRadius: 4
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Alunos por Bairro (Top 10)", font: { size: 16 } }
          }
        }
      });
    }
  };

  return (
    <Container className="py-4">
      {/* SEÇÃO SAÚDE */}
      <div className="mb-4 pb-3 border-bottom">
        <h1 className="fw-bold mb-2" style={{ color: "#0f172a" }}>Painel de Saúde - Recife</h1>
        <p className="text-secondary mb-0 fs-5">Monitoramento de Unidades de Saúde e Estoque de Medicamentos</p>
      </div>

      {loading ? (
        <div className="text-center py-5 text-secondary fs-4">
          <p>Conectando à API do Backend (localhost:8080)...</p>
        </div>
      ) : (
        <>
          {/* Cards Saúde */}
          <Row className="mb-4 g-4 justify-content-center">
            <Col xs={12} md={4} lg={4}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #3b82f6" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Total de USFs</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>{usfData.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #3b82f6" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Estoque de Medicamentos</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>{medicamentosData.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #3b82f6" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>RPAs Atendidas</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>
                    {new Set(usfData.map(u => u.rpa).filter(Boolean)).size}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #3b82f6" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Unidades de Preservativos (UDP)</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>{udpData.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #3b82f6" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Serviços de Apoio (SADT)</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>{sadtData.length}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4 g-4">
            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "350px", position: "relative" }} className="p-4">
                  <canvas id="chartUsfRpa"></canvas>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "350px", position: "relative" }} className="p-4">
                  <canvas id="chartMedTipo"></canvas>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5 g-4">
            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "400px", position: "relative" }} className="p-4">
                  <canvas id="chartMedTop10"></canvas>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "400px", position: "relative" }} className="p-4">
                  <canvas id="chartMedBottom10"></canvas>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SEÇÃO EDUCAÇÃO */}
          <div className="mt-5 mb-4 pb-3 border-bottom">
            <h1 className="fw-bold mb-2" style={{ color: "#0f172a" }}>Painel de Educação - Recife</h1>
            <p className="text-secondary mb-0 fs-5">Monitoramento da Educação Infantil e EJA</p>
          </div>

          <Row className="mb-4 g-4">
            <Col xs={12} md={6}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #10b981" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Alunos Matriculados</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>
                    {educacaoData.reduce((acc, curr) => acc + (curr.quantidade || 0), 0)}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="h-100 shadow-sm text-center border-0" style={{ borderTop: "4px solid #10b981" }}>
                <Card.Body className="d-flex flex-column justify-content-center py-4">
                  <h6 className="text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>Unidades de Ensino</h6>
                  <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem", color: "#0f172a" }}>
                    {new Set(educacaoData.map(e => e.unidadeEnsino).filter(Boolean)).size}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4 g-4">
            <Col xs={12} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "300px", position: "relative" }} className="p-4">
                  <canvas id="chartEduSexo"></canvas>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "300px", position: "relative" }} className="p-4">
                  <canvas id="chartEduRaca"></canvas>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5 g-4">
            <Col xs={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body style={{ height: "400px", position: "relative" }} className="p-4">
                  <canvas id="chartEduBairro"></canvas>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}