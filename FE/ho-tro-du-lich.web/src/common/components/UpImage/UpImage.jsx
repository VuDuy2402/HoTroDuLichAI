import { IKUpload } from "imagekitio-react";
import { forwardRef } from "react";

const UpImage = forwardRef(
  ({ label, onSuccess, onError, onUploadProgress, ...other }, ref) => {
    return (
      <div>
        {label && <label className="fw-bold">{label}</label>}
        <IKUpload
          ref={ref}
          onSuccess={onSuccess}
          onError={onError}
          onUploadProgress={onUploadProgress}
          {...other}
        />
      </div>
    );
  }
);

export default UpImage;
