// src/components/NotificationSummary.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "lottie-react";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import "./notification.css";
import {
  CNotificationType,
  CNotificationLevel,
  NotificationTypeDescriptions,
  NotificationLevelDescriptions,
} from '../../enum/notificationSummary';
import animationMap from "@/utils/animations";
import { getEnumValue, getQueryParameters } from "../../utils/queryParams";

const NotificationSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultMessage, setResultMessage] = useState(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const params = getQueryParameters();
    const level = getEnumValue(CNotificationLevel, params.level);
    const notificationType = getEnumValue(
      CNotificationType,
      params.notificationtype
    );
    const message = params.message;

    const hasLevel = level !== null;
    const hasMessage = message !== undefined && message.trim() !== "";
    const hasNotificationType = notificationType !== null;

    if (hasLevel && hasMessage && hasNotificationType) {
      setResultMessage({
        level,
        message,
        notificationType,
      });
    } else {
      toast.warn(
        "Thiếu tham số truy vấn cần thiết. Bạn không có quyền truy cập trang này."
      );
      setResultMessage(null);
    }
  }, [location.search]);

  useEffect(() => {
    if (
      resultMessage &&
      resultMessage.message &&
      resultMessage.level !== CNotificationLevel.NONE &&
      resultMessage.notificationType !== CNotificationType.NONE
    ) {
      const typeKey = Object.keys(CNotificationType).find(
        (key) => CNotificationType[key] === resultMessage.notificationType
      );
      const levelKey = Object.keys(CNotificationLevel).find(
        (key) => CNotificationLevel[key] === resultMessage.level
      );
      if (!typeKey || !levelKey) {
        toast.error("Loại thông báo hoặc mức độ thông báo không hợp lệ.");
        return;
      }

      const templateKey = `${typeKey}_Notification_Template_${levelKey}`;
      const animation = animationMap[templateKey];

      if (animation) {
        setAnimationData(animation);
      } else {
        toast.error(`Không tìm thấy hoạt hình cho: ${templateKey}`);
      }
    }
  }, [resultMessage]);

  const closeTab = () => {
    try {
      if (resultMessage.notificationType === CNotificationType.Register) {
        navigate("/login");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="auth-layout bg-white"
      style={{ height: "100vh", minHeight: "fit-content" }}
    >
      <ToastContainer />
      {resultMessage ? (
        <Container className="h-100">
          <div className="d-flex flex-column h-100 justify-content-center align-items-center p-2">
            <div className="content-notify d-flex flex-column justify-content-center">
              <h4 className="text-center">
                {NotificationTypeDescriptions[resultMessage.notificationType]}{" "}
                {NotificationLevelDescriptions[resultMessage.level]}
              </h4>
              <p className="text-center">{resultMessage.message}</p>
            </div>
            <div className="content-animation h-50">
              {animationData && (
                <Lottie
                  animationData={animationData}
                  style={{ height: "100%" }}
                />
              )}
            </div>
            <div>
              <div
                onClick={closeTab}
                className="btn btn-light d-flex align-items-center gap-2"
              >
                <i className="bi bi-arrow-return-left"></i>
                {resultMessage.notificationType === CNotificationType.Register
                  ? "Trở về Đăng Nhập"
                  : "Trở về Trang Chủ"}
              </div>
            </div>
          </div>
        </Container>
      ) : null}
    </div>
  );
};

export default NotificationSummary;
