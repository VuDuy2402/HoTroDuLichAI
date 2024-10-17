const RowInfo = ({ title, info }) => {
  return (
    <div className="row-info d-flex justify-content-between my-1 align-items-center">
      <p className="fw-bold bg-secondary-subtle w-50 p-1 m-0">{title}</p>
      <p className="w-50 text-end m-0">{info}</p>
    </div>
  );
};
export default RowInfo;
