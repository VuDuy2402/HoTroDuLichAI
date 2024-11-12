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
        <div className={`${col}`}>
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
            {...register(name, validate)}
            {...others}
          />
        </div>
      )}
      {!register && (
        <div className={`${col}`}>
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
