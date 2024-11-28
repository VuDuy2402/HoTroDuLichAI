import RegisterForm from "./RegisterForm";
import { Row, Col, Container } from "react-bootstrap";
import cauRongDN from "@/assets/img/caurongDanang.jpg";

const RegisterPage = () => {
  return (
    <Container fluid className="p-0 m-0 position-relative">
      <Row style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
        <Col xs={12} md={6}
          style={{
            margin: "0",
            padding: "0"
          }}
        >
          <img
            src={cauRongDN}
            alt="Cau Rong Da Nang"
            className="w-100 h-100 object-cover"
            style={{ objectFit: "cover", transform: "transition(-50%, 0)" }}
          />
        </Col>

        <Col xs={12} md={6} style={{
            margin: "0",
            padding: "0"
          }}
        >
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
