import { OverlayTrigger, Tooltip } from "react-bootstrap";


const UserInfo = ({userInfo}) => {    
    return (
        <>
            <div className="d-flex align-items-center text-center">
                <div className="me-2">Xin chào, {userInfo.name}</div>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip">
                            Email: {userInfo.email} <br />
                            Điện thoại: {userInfo.phoneNumber}
                        </Tooltip>
                    }
                >
                    <img
                        src={userInfo.Avatar || 'https://via.placeholder.com/100'}
                        alt="User"
                        className="rounded-circle mb-2"
                        style={{ width: '50px', height: '50px' }}
                    />
                </OverlayTrigger>
            </div>
        </>
    )
}

export default UserInfo;