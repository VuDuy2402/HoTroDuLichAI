import React, { useState, useRef } from "react";
import { IKUpload } from "imagekitio-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { systemAction } from "@/redux/slices/systemSlice";
import { FaFileUpload, FaTimes } from "react-icons/fa";
import styles from './ImageUploadGallery.module.scss';
import { Button } from "react-bootstrap";

const ImageUploadGallery = ({ onImagesUploaded }) => {
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
        onImagesUploaded(newImage.fileId);
    };

    const onUploadProgress = (progress) => {
        setUploading(true);
    };

    const removeImage = (fileId) => {
        setUploadedImages((prevImages) => prevImages.filter(image => image.fileId !== fileId));
    };

    return (
        <div className={styles.imageUploadContainer}>
            <div className={styles.uploadButtonContainer}>
                <IKUpload
                    className={styles.uploadInput}
                    ref={ikUploadRef}
                    onError={onError}
                    onSuccess={onSuccess}
                    onUploadProgress={onUploadProgress}
                    multiple
                />
                <Button
                    variant="outline-secondary"
                    size=""
                    onClick={() => ikUploadRef.current?.click()}
                    disabled={uploading}
                >
                    <FaFileUpload className="me-2" />
                    {uploading ? "Đang tải..." : "Tải lên ảnh"}
                </Button>
            </div>

            {uploading && (
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar}></div>
                </div>
            )}

            <div className={styles.gallery}>
                {uploadedImages.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                        <img src={image.url} alt={image.fileName} className={styles.image} />
                        <button
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
