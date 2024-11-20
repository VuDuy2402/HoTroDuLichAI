const ButtonCustom = ({
  title = "",
  className = "",
  style = {},
  noticeIcon = false,
  amountNotice = 0,
  ...others
}) => {
  return (
    <button
      className={className + " position-relative"}
      style={style}
      {...others}
    >
      {title}
      {noticeIcon && amountNotice > 0 && (
        <p
          className="position-absolute rounded-pill bg-danger d-flex justify-content-center align-items-center text-white m-0"
          style={{
            top: 0,
            right: 1,
            width: "22px",
            height: "22px",
            fontSize: "11px",
          }}
        >
          {amountNotice > 99 ? "99+" : amountNotice}
        </p>
      )}
    </button>
  );
};
export default ButtonCustom;
