import LoginForm from "./LoginForm";
import { Row, Col, Container } from "react-bootstrap";
import cauVangImg from "@/assets/img/cauvang.jpg";

const LoginPage = () => {
  return (
    <Container fluid className="p-0 m-0 position-relative reset-margin-padding">
      <Row style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
        <Col xs={12} md={6} style={{
          padding: "0",
          margin: "0"
        }}>
          <LoginForm />
        </Col>
        <Col xs={12} md={6} style={{
          padding: "0",
          margin: "0"
        }}>
          <img
            src={cauVangImg}
            alt="Cau Vang"
            className="w-100 h-100 object-cover"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
