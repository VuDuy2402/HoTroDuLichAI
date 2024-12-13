import profileDefault from "@/assets/img/profileavt.jpg";

const UserTag = ({ profile, onClick, size, className }) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 p-1 ${className}`}
    >
      <button
        className="btn btn-light h-100 d-flex align-items-center gap-1 rounded"
        onClick={onClick}
      >
        <img
          className="border rounded-pill"
          src={profile.picture ? profile.picture : profileDefault}
          style={
            !size || size === 3
              ? {
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                }
              : size === 1
              ? {
                  width: "20px",
                  height: "20px",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                }
              : size === 2
              ? {
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                }
              : {
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                }
          }
        ></img>
        <p
          className="m-0"
          style={
            size === 1
              ? {
                  maxWidth: "50px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.7rem",
                }
              : size === 2
              ? {
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.9rem",
                }
              : size === 3
              ? {
                  maxWidth: "80px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "1rem",
                }
              : {
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "1rem",
                }
          }
        >
          {profile.fullName}
        </p>
      </button>
    </div>
  );
};

export default UserTag;
