import { useEffect } from "react";

const Input = ({ id, label, register, name, col, className, ...others }) => {
  return (
    <>
      {register && (
        <div className={`${col}`}>
          {label && (
            <label className="fw-bold" htmlFor={id}>
              {label}
            </label>
          )}
          <input
            id={id}
            className={`form-control ${className}`}
            {...register(name)}
            {...others}
          />
        </div>
      )}
      {!register && (
        <div className={`${col}`}>
          {label && (
            <label className="fw-bold" htmlFor={id}>
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
