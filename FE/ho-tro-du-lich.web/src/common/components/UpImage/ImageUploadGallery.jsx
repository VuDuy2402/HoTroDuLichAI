import React, { useState, useRef } from "react";
import { IKUpload } from "imagekitio-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { systemAction } from "@/redux/slices/systemSlice";
import { FaTimes } from "react-icons/fa";
import styles from './ImageUploadGallery.module.scss';

const ImageUploadGallery = ({ onImagesUploaded }) => {
    const ikUploadRef = useRef(null);
    const dispatch = useDispatch();
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Hàm xử lý lỗi khi upload thất bại
    const onError = (err) => {
        toast.error(`Lỗi tải ảnh: ${err.message}`);
        setUploading(false);
    };

    // Hàm xử lý khi upload thành công
    const onSuccess = (res) => {
        setUploading(false);
        const newImage = {
            fileId: res.fileId,
            url: res.url,  // URL của hình ảnh đã upload
            fileName: res.fileName, // Tên file ảnh
        };

        setUploadedImages((prevImages) => [...prevImages, newImage]);
        onImagesUploaded(newImage.fileId);  // Truyền fileId về parent component
    };

    // Hàm xử lý khi upload đang diễn ra (hiển thị progress bar)
    const onUploadProgress = (progress) => {
        setUploading(true);
    };

    // Hàm xóa ảnh khỏi gallery
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
                <button
                    className={styles.uploadButton}
                    onClick={() => ikUploadRef.current?.click()}
                    disabled={uploading}
                    type="button"
                >
                    {uploading ? "Đang tải..." : "Tải lên ảnh"}
                </button>
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
