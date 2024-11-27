import React, { useState, useRef } from "react";
import { IKUpload } from "imagekitio-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { systemAction } from "@/redux/slices/systemSlice";
import { FaFileUpload, FaTimes } from "react-icons/fa";
import styles from "./ImageUploadGallery.module.scss";
import { Button } from "react-bootstrap";
import { MdOutlineUploadFile } from "react-icons/md";
const ImageUploadGallery = ({
  onImagesUploaded,
  onImagesRemove,
  label,
  multiple = true,
}) => {
  const ikUploadRef = useRef(null);
  const dispatch = useDispatch();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onError = (err) => {
    toast.error(`Lỗi tải ảnh: ${err.message}`);
    setUploading(false);
  };

  const onSuccess = (res) => {
    setUploading(false);
    const newImage = {
      fileId: res.fileId,
      url: res.url,
      fileName: res.fileName,
    };

    setUploadedImages((prevImages) => [...prevImages, newImage]);
    onImagesUploaded && onImagesUploaded(newImage.fileId);
  };

  const onUploadProgress = (progress) => {
    setUploading(true);
  };

  const removeImage = (fileId) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image.fileId !== fileId)
    );
    onImagesRemove && onImagesRemove(fileId);
  };

  return (
    <div className={"w-100" + styles.imageUploadContainer}>
      <div className={styles.uploadButtonContainer}>
        {label && <label className="fw-bold w-100 my-1">{label}</label>}
        <div className="d-flex gap-2">
          <IKUpload
            className={styles.uploadInput}
            ref={ikUploadRef}
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            multiple
          />
          {((!multiple && uploadedImages.length === 0) || multiple) && (
            <Button
              type="button"
              className="d-flex flex-column align-items-center justify-content-center p-0"
              variant="outline-secondary"
              size=""
              onClick={() => ikUploadRef.current?.click()}
              disabled={uploading}
              style={{
                borderStyle: "dashed",
                minWidth: "100px",
                width: "100px",
                minHeight: "100px",
                height: "100px",
              }}
            >
              <FaFileUpload size={25} />
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          )}
        </div>
      </div>

      {uploading && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}></div>
        </div>
      )}
      <div className={styles.gallery}>
        {uploadedImages.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <img
              src={image.url}
              alt={image.fileName}
              className={styles.image}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeImage(image.fileId)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadGallery;
