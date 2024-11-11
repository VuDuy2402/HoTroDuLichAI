const RowInfo = ({ title, info, color, styles, stylesValue }) => {
  return (
    <div className="row-info d-flex justify-content-between my-1 align-items-center">
      <p
        className={`fw-bold ${
          !color && !styles ? "bg-secondary-subtle" : ""
        } w-50 p-1 m-0`}
        style={color ? { background: color, ...styles } : { ...styles }}
      >
        {title}
      </p>
      <p className="w-50 text-end m-0" style={{ ...stylesValue }}>
        {info}
      </p>
    </div>
  );
};
export default RowInfo;
