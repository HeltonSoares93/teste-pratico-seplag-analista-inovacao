import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="mt-5 py-4 border-top text-muted">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="mb-1 fw-semibold">
              Projeto Desafio Prático - Analista de Inovação (SEPLAG) - Prefeitura do Recife
            </p>
            <p className="mb-0 small">
              Desenvolvedor: Helton Gomes Soares de Lima
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-1 small">
              <i className="bi bi-envelope me-1"></i> E-mail: <a href="mailto:helton2009@gmail.com" className="text-decoration-none text-muted">helton2009@gmail.com</a>
            </p>
            <p className="mb-0 small">
              <i className="bi bi-whatsapp me-1"></i> Whatsapp: <a href="https://wa.me/5581986477883" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">(81) 98647-7883</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
