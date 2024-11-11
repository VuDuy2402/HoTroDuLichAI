const Textarea = ({ id, label, register, name, ...others }) => {
  return (
    <div>
      {label && (
        <label className="fw-bold" htmlFor={id}>
          {label}
        </label>
      )}
      {register && (
        <textarea
          id={id}
          className="form-control"
          {...register(name)}
          {...others}
        />
      )}
      {!register && <textarea id={id} className="form-control" {...others} />}
    </div>
  );
};

export default Textarea;
