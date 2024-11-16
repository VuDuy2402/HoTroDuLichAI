const Input = ({
  id,
  label,
  register,
  name,
  col,
  className,
  classLabel,
  validate,
  ...others
}) => {
  return (
    <>
      {register && (
        <div className={`${col ? col : "w-100"}`}>
          {label && (
            <label
              className={`${classLabel ? classLabel : "fw-bold"}`}
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
        </div>
      )}
      {!register && (
        <div className={`${col ? col : "w-100"}`}>
          {label && (
            <label
              className={`${classLabel ? classLabel : "fw-bold"}`}
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
