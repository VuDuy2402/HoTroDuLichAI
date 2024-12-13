import { useState, useEffect } from "react";
import styles from "./Dropdown.module.scss";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns"; // For formatting dates (e.g. '5 minutes ago')

/**
 * Notification Dropdown for displaying notifications
 * @param {Array} notifications - List of notification objects
 * @param {Function} onClick - Callback when a notification is clicked
 * @param {Function} onLoadMore - Callback to load more notifications
 * @param {Boolean} hasMore - Whether there are more notifications to load
 * @param {Number} unreadCount - The number of unread notifications
 * @param {Boolean} resetUnreadCount - Whether to reset unread notifications
 * @param {Function} onMarkAllRead - Callback to mark all notifications as read
 */
const NotificationDropdown = ({
    notifications,
    onClick,
    onLoadMore,
    hasMore,
    unreadCount,
    resetUnreadCount,
    onMarkAllRead,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Mark all notifications as read when opened
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            resetUnreadCount();
        }
    }, [isOpen, unreadCount, resetUnreadCount]);

    return (
        <div className="drop-down position-relative">
            <button
                className="btn btn-light position-relative"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <IoAlertCircle size={24} className="text-warning" />
                {unreadCount > 0 && (
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
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </p>
                )}
            </button>

            {isOpen && (
                <div
                    className={`position-absolute d-flex flex-column gap-2 rounded ${styles.dropdown}`}
                    style={{
                        top: "100%",
                        minWidth: "200px",
                        textAlign: "left",
                        maxHeight: "500px",
                        overflowY: "auto",
                    }}
                >
                    {notifications.length > 0 ? (
                        notifications.map((notification, idx) => (
                            <div
                                key={idx}
                                className={`${styles.item} d-flex align-items-center`}
                                onClick={() => onClick(notification)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="me-2">
                                    {notification.isRead ? (
                                        <IoCheckmarkCircle size={20} className="text-success" />
                                    ) : (
                                        <IoAlertCircle size={20} className="text-danger" />
                                    )}
                                </div>
                                <div className="m-0" style={{ maxWidth: "100%" }}>
                                    <strong>{notification.title}</strong>
                                    <p className="m-0" style={{ fontSize: "12px" }}>
                                        {notification.content}
                                    </p>
                                    <small>{formatDistanceToNow(new Date(notification.createdDate), { addSuffix: true })}</small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`${styles.item} ${styles.empty}`}>
                            <p className="m-0">Không có thông báo mới</p>
                        </div>
                    )}
                    {hasMore && (
                        <div
                            className={`${styles.item} ${styles.loadMore}`}
                            onClick={onLoadMore}
                            style={{ cursor: "pointer" }}
                        >
                            <p className="m-0 text-center">Xem thêm</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;