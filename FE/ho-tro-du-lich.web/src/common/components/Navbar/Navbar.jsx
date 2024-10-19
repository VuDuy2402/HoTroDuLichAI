import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../../services/authServices";
import styles from "./Navbar.module.scss";
import { localStorageService } from "../../../services/localstorageService";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../redux/slices/authSlices";
import { memo, useCallback, useEffect, useState } from "react";
import { userService } from "../../../services/userSerivce";
import UserTag from "../UserTag/UserTag";
import {
  getAuthSelector,
  getUserProfileSelector,
} from "../../../redux/selectors/authSelector";
import LinkCustom from "../LinkCustom/LinkCustom";

const contentItem = [
  { title: "Trang Chủ", url: "/" },
  { title: "Tour trong nước", url: "/tourtrongnuoc" },
  { title: "Tour nước ngoài", url: "/tournuocngoai" },
  { title: "Tin tức", url: "/tintuc" },
  { title: "Liên hệ", url: "/liên hệ" },
];

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getAuth = useSelector(getAuthSelector);
  const getUserProfile = useSelector(getUserProfileSelector);

  const handleLogin = () => {
    navigate("/dangnhap");
  };
  const [userProfile, setuserProfile] = useState(null);
  const handleLogout = async () => {
    const res = await authService.logout();
    if (res.success) {
      localStorageService.removeToken();
      dispatch(authAction.reset());
      navigate("/dangnhap");
    }
  };
  const handleRegister = () => {
    navigate("/dangky");
  };
  const handleClickUserTag = () => {
    navigate("/thongtincanhan");
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (getUserProfile) {
        setuserProfile(getUserProfile);
        return;
      }
      const result = await userService.getBaseProfile();
      if (result && result.success) {
        setuserProfile(result.data);
        dispatch(authAction.setInfoUser(result.data));
      } else {
        setuserProfile(null);
      }
    };
    fetchApi();
  }, [getAuth]);

  return (
    <nav className={`w-100 bg-success shadow ${styles.navbar}`}>
      <div
        className={`${className} h-100 d-flex justify-content-between align-items-center`}
      >
        <div className="navbar__content_title d-flex">
          <div
            className={`navbar__logo d-flex align-items-center ${styles.navbar_logo}`}
          >
            <p className="m-0 text-white">DU LỊCH</p>
          </div>
          <div className="navbar__content__item ms-3 d-flex gap-1 align-items-center">
            {contentItem.map((item, idx) => (
              <LinkCustom
                key={idx}
                title={item.title}
                url={item.url}
                className={
                  item.url === location.pathname
                    ? "text-warning fw-bold"
                    : "text-white fw-bold"
                }
              />
            ))}
          </div>
        </div>
        <div
          className={`navbar__btn d-flex gap-2 align-items-center ${styles.navbar_btn}`}
        >
          {userProfile ? (
            <>
              <UserTag profile={userProfile} onClick={handleClickUserTag} />
              <button
                className={`btn btn-light fw-bold rounded-0  navbar__btn__dangxuat text-warning `}
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className={`btn btn-light fw-bold rounded-0  navbar__btn__dangnhap`}
              >
                Đăng nhập
              </button>
              <button
                className={`btn btn-light border-1 border-warning fw-bold text-warning rounded-0  navbar__btn__dangxuat`}
                onClick={handleRegister}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
