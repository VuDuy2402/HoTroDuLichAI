import { useLocation, useNavigate } from "react-router-dom";
import { systemAction } from "@/redux/slices/systemSlice";
import { authService } from "../../../services/authServices";
import styles from "./Navbar.module.scss";
import { localStorageService } from "../../../services/localstorageService";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../redux/slices/authSlices";
import { memo, useEffect, useState } from "react";
import { userService } from "../../../services/userSerivce";
import { publisherService } from "../../../services/publisherService";
import UserTag from "../UserTag/UserTag";
import {
  getAuthSelector,
  getUserProfileSelector,
  getUserRoleSelector,
} from "../../../redux/selectors/authSelector";
import LinkCustom from "../LinkCustom/LinkCustom";
import { Role } from "../../../enum/permission";
import { Modal, Button, Form } from "react-bootstrap";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { TbLogin } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApps } from "react-icons/md";
import DropdownCustom from "../Dropdown/Dropdown";
import { IoLogOutSharp } from "react-icons/io5";
const contentItem = [
  { title: "Trang Chủ", url: "/" },
  { title: "Tin Tức", url: "/khoahoc" },
  { title: "Địa điểm", url: "/khoahoc" },
];

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getAuth = useSelector(getAuthSelector);
  const getUserProfile = useSelector(getUserProfileSelector);
  const getUserRoles = useSelector(getUserRoleSelector);
  const [errorList, setErrorList] = useState([]);
  const handleLogin = () => {
    navigate("/dangnhap");
  };
  const [userProfile, setuserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
    videoUrl: "",
  });
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const dataToSend = {
      FullName: formData.fullName,
      Email: formData.email,
      Description: formData.description,
      VideoUrl: formData.videoUrl,
    };
    dispatch(systemAction.enableLoading());
    const result = await publisherService.requestBecomeToAPublisher(dataToSend);
    if (result && result.success) {
      dispatch(systemAction.disableLoading());
      window.location.href = result.data;
      setShowModal(false);
    } else {
      dispatch(systemAction.disableLoading());
      if (result.errors) {
        setErrorList(result.errors);
      }
    }
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

  const generateBtnRole = () => {
    const listBtn = [];
    if (!userProfile) {
      return listBtn;
    }
    if (getUserRoles && getUserRoles.length > 0) {
      if (getUserRoles.includes(Role.Publisher)) {
        listBtn.push({ label: "Publisher Page", id: 1 });
      }
    }
    if (getUserRoles.includes(Role.Admin)) {
      listBtn.push({
        label: "Admin Page",
        id: 2,
      });
    }

    if (windowSize.width <= 767) {
      listBtn.push({
        label: <UserTag profile={userProfile} />,
        id: 4,
      });
      listBtn.push({
        label: (
          <button
            type="button"
            className={`btn btn-light fw-bold rounded-0  navbar__btn__dangxuat text-warning `}
          >
            <IoLogOutSharp /> Đăng xuất
          </button>
        ),
        id: 5,
      });
    }
    return listBtn;
  };
  const handleClickDropdownRole = (data) => {
    if (data.id === 1) {
      navigate("/publisher");
    }
    if (data.id === 2) {
      navigate("/admin");
    }
    if (data.id === 4) {
      handleClickUserTag();
    }
    if (data.id === 5) {
      setShowConfirmLogout(true);
    }
  };

  return (
    <>
      <nav className={`w-100 shadow bg-white ${styles.navbar}`}>
        <div
          className={`${className} h-100 d-flex justify-content-between align-items-center`}
        >
          <div className="navbar__content_title d-flex">
            <div
              className={`navbar__logo d-flex align-items-center ${styles.navbar_logo}`}
              onClick={() => navigate("/")}
            >
              <p className="p-1 m-0 text-success">DU LỊCH</p>
            </div>
            <div className="navbar__content__item ms-3 d-flex gap-1 align-items-center">
              {contentItem.map((item, idx) => (
                <LinkCustom
                  key={idx}
                  title={item.title}
                  url={item.url}
                  className={
                    item.url === location.pathname
                      ? "text-success fw-bold"
                      : "text-black fw-bold"
                  }
                />
              ))}
            </div>
          </div>
          <div
            className={`navbar__btn d-flex gap-1 align-items-center ${styles.navbar_btn}`}
          >
            {userProfile ? (
              <>
                <DropdownCustom
                  title={<MdOutlineApps />}
                  classBtn={"btn btn-light rounded-0"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem="p-1 d-flex justify-content-center"
                  items={generateBtnRole()}
                  styleDropdown={{ right: 0, width: "150px" }}
                  autoClose
                  onClick={handleClickDropdownRole}
                />
                {windowSize.width > 768 && (
                  <>
                    <UserTag
                      profile={userProfile}
                      onClick={handleClickUserTag}
                    />
                    <button
                      className={`btn btn-light fw-bold rounded-0  navbar__btn__dangxuat text-warning `}
                      onClick={() => setShowConfirmLogout(true)}
                    >
                      <IoLogOutSharp />
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className={`btn btn-outline-success bg-white text-success rounded-0  navbar__btn__dangnhap`}
                >
                  {windowSize.width <= 767 ? (
                    <TbLogin color="#157347" size={"20px"} />
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
                <button
                  className={`btn btn-success border-1 rounded-0  navbar__btn__dangxuat ${
                    windowSize.width > 767 ? "" : ""
                  }`}
                  onClick={handleRegister}
                >
                  {windowSize.width <= 767 ? <FaUserPlus /> : "Đăng ký"}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Trở thành người dạy đàn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitForm}>
            <FormErrorAlert errors={errorList} />
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <ErrorField errorList={errorList} field={"FullName_Error"} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <ErrorField errorList={errorList} field={"Email_Error"} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Giới thiệu bản thân</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <ErrorField errorList={errorList} field={"Description_Error"} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="videoUrl">
              <Form.Label>Video bài giảng (URL)</Form.Label>
              <Form.Control
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                required
              />
              <ErrorField errorList={errorList} field={"VideoUrl_Error"} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Gửi yêu cầu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showConfirmLogout}
        onHide={() => setShowConfirmLogout(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông Báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn chắc chắn muốn đăng xuất ?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-light"
            onClick={() => setShowConfirmLogout(false)}
          >
            Đóng
          </button>
          <button className="btn btn-warning" onClick={handleLogout}>
            Xác nhận
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(Navbar);
