import courseImg from "../../../assets/img/Free-Online-Course-2.jpg";
import styles from "./Card.module.scss";
import { FaStar } from "react-icons/fa6";
import { IoHeartSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import IconInfo from "../IconInfo/IconInfo";
import { userService } from "../../../services/userSerivce";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
const Card = ({ data, isFavorite, onCancelIntake, onClickDetail }) => {
  const handleFavorite = async (id) => {
    const addFavorite = await userService.postIntakeFavorite({ id: id });
    if (addFavorite) {
      if (addFavorite.data && addFavorite.success) {
        toast.success("Thêm vào khoá học yêu thích thành công");
      } else {
        toast.error(addFavorite?.errors[0]?.error);
      }
    } else {
      toast.error("Lỗi chưa xác định");
    }
  };
  const handleCancelFavorite = async (id) => {
    const cancelFavorite = await userService.cancelIntakeFavorite(id);
    if (cancelFavorite && cancelFavorite.success) {
      toast.success("Đã bỏ thích khoá học");
      onCancelIntake();
    } else {
      toast.error("Xảy ra lỗi " + cancelFavorite?.errors[0]?.error);
    }
  };
  const handleClickDetail = (id) => {
    onClickDetail(id);
  };
  return (
    <div className={`card shadow rounded-2 overflow-hidden ${styles.card}`}>
      <img
        src={data?.courseIntakeThumbnailUrl || courseImg}
        className="w-100 h-50"
      />
      <div className="card__content p-2">
        <div className="row">
          <h4
            className={`card__content__title ${styles.cardTitle}`}
            onClick={() => handleClickDetail(data?.courseIntakeId)}
          >
            {data?.courseIntakeName || "default"}
          </h4>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <p className="m-0 fw-bold text-body-secondary">
            {data?.courseOwnerFullName || "default"}
          </p>
          <div className="rating d-flex align-items-center gap-1">
            <FaStar color="#ffcf00" />
            <span className="fw-bold">{data?.rating || 0}</span>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <IconInfo icon={<FaUser />} text={data?.enrollmentCount || 0} />
          <IconInfo icon={<FaEye />} text={data?.totalViewCount || 0} />
        </div>
        <div className="row">
          {data?.discountRate > 0 ? (
            <div className="">
              <h4 className="text-warning pt-2 m-0">
                {data?.priceAfterDiscount + " VND"}
              </h4>
              <div className="frame-origin-price d-flex align-items-center gap-2">
                <h5 className="text-secondary m-0 p-0 text-decoration-line-through">
                  {data?.price + " VND"}
                </h5>
                <p className="text-danger fw-bold p-0 m-0">{`-${data?.discountRate}%`}</p>
              </div>
            </div>
          ) : (
            <h4 className="text-warning pt-2 m-0">
              {(data?.price || 0) + " VND"}
            </h4>
          )}
        </div>
      </div>
      <div className="card__footer p-2 mt-auto d-flex gap-2 justify-content-end">
        <button
          className="btn btn-outline-warning fw-bold"
          onClick={() => handleClickDetail(data?.courseIntakeId)}
        >
          Đăng Ký Ngay
        </button>
        {isFavorite ? (
          <button
            className="btn btn-outline-danger"
            onClick={() => handleCancelFavorite(data?.courseIntakeId)}
          >
            <FaRegTrashAlt />
          </button>
        ) : (
          <button
            className="btn btn-outline-danger"
            onClick={() => handleFavorite(data?.courseIntakeId)}
          >
            <IoHeartSharp color="#ff8787" />
          </button>
        )}
      </div>
    </div>
  );
};
export default Card;
