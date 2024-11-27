import { ErrorMessage } from "@hookform/error-message";
const Input = ({
  id,
  label,
  register,
  name,
  col,
  className,
  classLabel,
  validate,
  errors,
  ...others
}) => {
  return (
    <>
      {register && (
        <div className={`${col ? col : "w-100 my-2"}`}>
          {label && (
            <label
              className={`${classLabel ? classLabel : "fw-bold my-1"}`}
              htmlFor={id}
            >
              {label}
            </label>
          )}
          <input
            id={id}
            className={`form-control ${className}`}
            {...others}
            {...register(name, validate)}
          />
          {errors && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => <p className="text-danger">{message}</p>}
            />
          )}
        </div>
      )}
      {!register && (
        <div className={`${col ? col : "w-100 my-2"}`}>
          {label && (
            <label
              className={`${classLabel ? classLabel : "fw-bold my-1"}`}
              htmlFor={id}
            >
              {label}
            </label>
          )}
          <input id={id} className={`form-control ${className}`} {...others} />
        </div>
      )}
    </>
  );
};

export default Input;
