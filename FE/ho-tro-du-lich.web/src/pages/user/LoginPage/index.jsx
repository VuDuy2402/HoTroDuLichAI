import LoginForm from "./LoginForm";
import styles from "./Login.module.scss";
import cauVangImg from "@/assets/img/cauvang.jpg";
const LoginPage = () => {
  return (
    <div
      className={`login-page container-fluid position-relative p-0 m-0 ${styles.loginpage}`}
    >
      <div
        className={`login-page__card rounded-2 d-flex overflow-hidden ${styles.loginpage__card}`}
      >
        <div className="p-5 w-50 d-flex align-items-center bg-success-subtle">
          <LoginForm />
        </div>
        <div
          className="login-form__image w-50 h-100 d-flex justify-content-center overflow-hidden"
          style={{ objectFit: "cover" }}
        >
          <img
            src={cauVangImg}
            className="h-100"
            style={{ transform: "transition(-50%,0)" }}
          />
        </div>
      </div>
      <div
        className={`login-page__background w-100 h-100 ${styles.loginpage__background}`}
        // style={{ backgroundImage: `url(${bgDanang})` }}
      ></div>
    </div>
  );
};

export default LoginPage;
