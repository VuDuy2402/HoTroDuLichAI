import RegisterForm from "./RegisterForm";
import styles from "./Register.module.scss";
import cauRongDN from "@/assets/img/caurongDanang.jpg";
const RegisterPage = () => {
  return (
    <div
      className={`login-page container-fluid position-relative p-0 m-0 ${styles.loginpage}`}
    >
      <div
        className={`login-page__card rounded-2 d-flex overflow-hidden ${styles.loginpage__card}`}
      >
        <div
          className="login-form__image w-50 h-100 d-flex justify-content-center overflow-hidden"
          style={{ objectFit: "cover" }}
        >
          <img
            src={cauRongDN}
            className="h-100"
            style={{ transform: "transition(-50%,0)" }}
          />
        </div>
        <div className="p-5 w-50 d-flex align-items-center bg-success-subtle">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
