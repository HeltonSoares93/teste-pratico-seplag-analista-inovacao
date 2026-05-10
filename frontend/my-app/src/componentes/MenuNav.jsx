import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/logo_gestao_pcr_alt_horizontal.png';
import { Link } from 'react-router-dom';

export default function MenuNav() {

  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light"  >
      <Container>
        <Navbar.Brand as={Link} to="/sobre">
          <img
            alt=""
            src={logo}
            width="267"
            // height="30"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/painel">Painel</Nav.Link>
            <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
            <NavDropdown title="Saúde" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/medicamentos">Estoque de Medicamentos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/unidadessaudedafamilia">
                Unidades de Saúde da Família
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/unidadesdistribuicaopreservativos">
                Unidades de Distribuição Preservativos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/servicosdeapoiodiagnosticoeterapeutico">
                Serviços de Apoio Diagnóstico e Terapêutico
              </NavDropdown.Item>
              {/* <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item> */}
            </NavDropdown>
            <NavDropdown title="Educação" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/educacaoinfantileja">Dados Sobre Educação Infantil <br />e de Jovens e Adultos (EJA)</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}