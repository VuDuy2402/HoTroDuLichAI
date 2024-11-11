import { IKImage, IKUpload, IKVideo } from "imagekitio-react";
import styles from "./UploadCustom.module.scss";
import { PiUploadBold } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import Modal from "../Modal/Modal";
import { IoMdClose } from "react-icons/io";
import { isImgPath, isVideoPath } from "../../../utils/functionUtils";

const urlImgkit = "https://ik.imagekit.io/ts9i7pkav";
/**
 *
 * @param  fileInfo {filePath:string, fileName:string}
 * @returns
 */
const UploadCustom = ({
  uploadType,
  label,
  color,
  fileInfo,
  onChangeFile,
  onSuccess,
  resetDelete,
  ...others
}) => {
  const uploadRef = useRef();
  const [openModalView, setOpenModalView] = useState(false);
  const [deleteFile, setDeleteFile] = useState(true);
  const [uploadClone, setUploadClone] = useState(null);
  const handleChangeFile = (file) => {
    onSuccess(file);
    if (file === null) {
      setUploadClone(null);
    } else {
      setUploadClone({ filePath: file.filePath, fileName: file.name });
      setDeleteFile(false);
    }
  };
  useEffect(() => {

    if (!fileInfo && !uploadClone) {
      setDeleteFile(true);
    } else {
      setDeleteFile(false);
      setUploadClone(null);
    }
  }, [resetDelete]);

  return (
    <div>
      <label className="fw-bold">{label}</label>
      <div
        className={`${styles.uploadcustom}`}
        style={color ? { borderColor: color } : {}}
      >
        <IKUpload
          ref={uploadRef}
          className={`${styles.uploaditem}`}
          accept={
            uploadType === "video"
              ? "video/*"
              : uploadType === "img"
              ? "image/*"
              : ""
          }
          onSuccess={handleChangeFile}
          {...others}
        />
        <div
          className={`w-100 h-100 ${styles.uploaddisplay}`}
          onClick={() => {
            ((!uploadClone && !fileInfo && deleteFile) ||
              (!uploadClone && fileInfo && !fileInfo.filePath) || //chưa up gì hết
              (fileInfo && fileInfo.filePath && deleteFile && !uploadClone)) &&
              uploadRef.current.click();
          }}
        >
          {((fileInfo && fileInfo.filePath) || uploadClone) && !deleteFile ? (
            <div className="d-flex w-100 h-100 justify-content-center align-items-center flex-column">
              <div
                className="d-flex flex-column align-items-center"
                onClick={() => {
                  setOpenModalView(true);
                }}
              >
                <FaRegFileAlt size={"25px"} />
                <p className="m-0">
                  {uploadClone
                    ? uploadClone.fileName
                    : fileInfo && fileInfo.fileName}
                </p>
              </div>
              <button
                type="button"
                className="btn m-0 text-danger"
                style={{ fontSize: "0.8rem" }}
                onClick={() => {
                  setDeleteFile(true);
                  handleChangeFile(null);
                }}
              >
                Xoá file này
              </button>
            </div>
          ) : (
            <>
              <p className="m-0">Tải file lên</p>
              <PiUploadBold className="w-25 h-25" color={color} />
            </>
          )}
        </div>
      </div>
      {(fileInfo && fileInfo.filePath) ||
        (uploadClone && openModalView && (
          <Modal status={openModalView}>
            <ModalContent
              path={uploadClone ? uploadClone.filePath : fileInfo.filePath}
              onClose={() => setOpenModalView(false)}
            />
          </Modal>
        ))}
    </div>
  );
};

const ModalContent = ({ path, onClose }) => {
  const imgRef = useRef();
  const videoRef = useRef();
  return (
    <div className="w-100">
      <div className="d-flex flex-column gap-2">
        <button className="ms-auto btn" onClick={onClose}>
          <IoMdClose />
        </button>
        {isVideoPath(path) && (
          <video
            ref={videoRef}
            className="w-100"
            src={path}
            onError={() => {
              videoRef.current.src = urlImgkit + path;
            }}
            controls={true}
          />
        )}
        {isImgPath(path) && (
          <img
            ref={imgRef}
            className="w-100"
            src={path}
            onError={() => {
              imgRef.current.src = "https://ik.imagekit.io/ts9i7pkav" + path;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UploadCustom;
