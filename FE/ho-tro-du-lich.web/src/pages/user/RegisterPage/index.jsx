import RegisterForm from "./RegisterForm";
import { Row, Col, Container } from "react-bootstrap";
import cauRongDN from "@/assets/img/CauRong.jpg";
import useDocumentTitle from "../../../common/js/useDocumentTitle";

const RegisterPage = () => {
  useDocumentTitle('Đăng ký');
  return (
    <Container fluid className="p-0 m-0 position-relative">
      <Row style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
        <Col
          xs={12}
          md={6}
          style={{ padding: "0", margin: "0" }}
        >
          <img
            src={cauRongDN}
            alt="Cau Rong Da Nang"
            className="w-100 h-100 object-cover"
            style={{ objectFit: "cover" }}
          />
        </Col>

        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center"
          style={{ padding: "0", margin: "0" }}
        >
          <div
            style={{
              width: "450px",
              height: "80vh",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "30px",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <RegisterForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
