import styles from "./Checkbox.module.scss";
const Checkbox = ({ id, className, label, register, name, ...others }) => {
  return (
    <>
      {register && (
        <div className="d-flex gap-3 align-items-center">
          <label className="fw-bold" htmlFor={id}>
            {label}
          </label>
          <input
            id={id}
            className={`text-warning bg-warning ${styles.checkbox} ${
              className ?? ""
            }`}
            type="checkbox"
            {...register(name)}
            {...others}
          />
        </div>
      )}
      {!register && (
        <div className="d-flex gap-3 align-items-center">
          <label className="fw-bold" htmlFor={id}>
            {label}
          </label>
          <input
            id={id}
            className={`text-warning bg-warning ${styles.checkbox} ${
              className ?? ""
            }`}
            type="checkbox"
            {...others}
          />
        </div>
      )}
    </>
  );
};

export default Checkbox;
