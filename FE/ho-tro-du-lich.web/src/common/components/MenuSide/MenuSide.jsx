import { IoMenuOutline } from "react-icons/io5";
import "./Menuside.scss";
import { useLocation, useNavigate } from "react-router-dom";
// const itemTest = [
//   { label: "Tài khoản", url: "/thongtincanhan" },
//   { label: "Khoá học Yêu thích", url: "/thongtincanhan/khoahocyeuthich" },
// ];
const MenuSide = ({ items, status, onChangeStatus, onClickItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      className={`menu-side ${
        status ? "open" : "hide"
      } h-100 bg-white d-flex flex-column ${
        status ? "border border-end" : ""
      } m-0`}
      style={
        status
          ? {
              minWidth: "200px",
              maxWidth: "250px",
            }
          : {
              minWidth: "50px",
              maxWidth: "50px",
            }
      }
    >
      <div className="navbar__toggle position-sticky p-1" style={{ top: 0 }}>
        <button
          className={`d-block btn-toggle btn btn-light border bg-white ${
            status ? "ms-auto" : ""
          }`}
          onClick={onChangeStatus}
        >
          <IoMenuOutline />
        </button>
      </div>
      <div
        className="border-1 border-top h-100 p-1 d-flex flex-column gap-1"
        style={
          status
            ? {
                overflow: "auto",
                minWidth: "200px",
                maxWidth: "250px",
              }
            : {
                overflow: "hidden",
                minWidth: "0px",
                maxWidth: "0px",
              }
        }
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => (item.url ? navigate(item.url) : onClickItem(item))}
            className={`btn btn-light ${
              item.url === location.pathname ? "text-warning fw-bold" : ""
            } w-100 py-3 rounded-0 text-start`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuSide;
