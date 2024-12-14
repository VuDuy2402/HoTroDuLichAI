import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { placeService } from "../../../services/placeService";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import MapCustom from "../../../common/components/MapCustom/MapCustom";

const AUpdatePlacePage = ({ show, onClose, placeId, onPlaceUpdated }) => {
    const [placeDetail, setPlaceDetail] = useState(null);
    const [positionMap, setPositionMap] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleSubmit, setValue, formState: { errors } } = useForm();
    const [selectedPlaceType, setSelectedPlaceType] = useState(CPlaceType.None);
    const [errorMessages, setErrorMessages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [defaultImageId, setDefaultImageId] = useState(null);
    const [selectedImagesForDeletion, setSelectedImagesForDeletion] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (placeId && show) {
            fetchPlaceDetail();
        }
    }, [placeId, show]);

    const fetchPlaceDetail = async () => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await placeService.getPlaceById(placeId);
            if (result && result.success) {
                setPlaceDetail(result.data);
                setValue("name", result.data.name);
                setValue("address", result.data.address);
                setValue("description", result.data.description);
                setPositionMap({
                    latitude: result.data.latitude,
                    longitude: result.data.longitude
                });
                setSelectedPlaceType(result.data.placeType || CPlaceType.None);
                setValue("isNew", result.data.isNew);
                const updatedImageFiles = (result.data.imageDetailProperties || []).map(img => ({
                    fileId: img.fileId,
                    url: img.url,
                    isDefault: img.isDefault || false
                }));
                setImageFiles(updatedImageFiles);
                const defaultImage = result.data.imageDetailProperties.find(img => img.isDefault);
                setDefaultImageId(defaultImage ? defaultImage.fileId : null);
            } else if (result && result.errors) {
                setErrorMessages(result.errors);
            }
        } catch (error) {
            toast.error("Error fetching place details:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    const handleImagesUploaded = (uploadedImages) => {   
        if (Array.isArray(uploadedImages)) {
            const updatedImages = uploadedImages.map(img => ({
                fileId: img.fileId,
                url: img.url,
                isDefault: false,
            }));
            setImageFiles((prev) => [...prev, ...updatedImages]);
        } else if (uploadedImages && uploadedImages.fileId) {
            setImageFiles((prev) => [
                ...prev,
                { fileId: uploadedImages.fileId, url: uploadedImages.url, isDefault: false },
            ]);
        } else {
            toast.error("Dữ liệu trả về từ ImageUploadGallery không hợp lệ:", uploadedImages);
        }
    };

    const handleImagesRemove = (fileId) => {
        setImageFiles((prev) => prev.filter((img) => img.fileId !== fileId));
    };

    const handleSetDefaultImage = (fileId) => {
        setDefaultImageId(fileId);
    };

    const handleSelectImageForDeletion = (fileId) => {
        setSelectedImagesForDeletion(prev =>
            prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
        );
    };

    const handleDeleteSelectedImages = async () => {
        if (selectedImagesForDeletion.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một hình ảnh để xóa.");
            return;
        }

        try {
            const result = await placeApi.deletePlaceImagesAdmin({
                PlaceId: placeId,
                FileIds: selectedImagesForDeletion
            });
            if (result && result.success) {
                toast.success("Xóa hình ảnh thành công.");
                setImageFiles(prev => prev.filter(img => !selectedImagesForDeletion.includes(img.fileId)));
                setSelectedImagesForDeletion([]);
            } else {
                toast.error("Xóa hình ảnh thất bại.");
            }
        } catch (error) {
            toast.error("Lỗi khi xóa hình ảnh.", error);
        }
    };

    const handleSubmitUpdate = async (data) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        dispatch(systemAction.enableLoading());

        const updatedData = {
            PlaceId: placeId,
            Address: data.address,
            IsNew: data.isNew,
            Longitude: positionMap[1],
            Latitude: positionMap[0],
            Description: data.description,
            Name: data.name,
            PlaceType: selectedPlaceType,
            ImageFiles: imageFiles.map(img => ({
                FileId: img.fileId,
                IsDefault: img.fileId === defaultImageId
            }))
        };

        try {
            const result = await placeService.updatePlaceAdmin(updatedData);
            if (result && result.success) {
                toast.success("Place updated successfully.");
                onPlaceUpdated();
                onClose();
            } else {
                toast.error("Failed to update place.");
            }
        } catch (error) {
            toast.error("Error updating place:", error);
        } finally {
            setIsSubmitting(false);
            dispatch(systemAction.disableLoading());
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật địa điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {placeDetail ? (
                    <Form onSubmit={handleSubmit(handleSubmitUpdate)}>
                        <FormErrorAlert errors={errorMessages} />
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên địa điểm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={placeDetail.name}
                                    />
                                    <ErrorField errorList={errorMessages} field={"Name_Error"} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={placeDetail.address}
                                    />
                                    <ErrorField errorList={errorMessages} field={"Address_Error"} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <MapCustom
                                latitude={positionMap?.latitude}
                                longitude={positionMap?.longitude}
                                label="Location"
                                pin={false}
                                onChangePosition={(data) => setPositionMap(data)}
                            />
                            <ErrorField errorList={errorMessages} field={"Longitude_Error"} />
                            <ErrorField errorList={errorMessages} field={"Latitude_Error"} />
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        defaultValue={placeDetail.description}
                                    />
                                    <ErrorField errorList={errorMessages} field={"Description_Error"} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại địa điểm</Form.Label>
                                    <Form.Select
                                        value={selectedPlaceType}
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            setSelectedPlaceType(newValue);
                                            setValue("placeType", newValue);
                                        }}
                                    >
                                        {Object.keys(CPlaceType).map(key => (
                                            <option key={key} value={CPlaceType[key]}>
                                                {PlaceTypeDescriptions[CPlaceType[key]]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Là địa điểm mới</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        defaultChecked={placeDetail.isNew}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <ImageUploadGallery
                                        onImagesUploaded={handleImagesUploaded}
                                        onImagesRemove={handleImagesRemove}
                                        multiple={true}
                                        returnUrl={true}
                                    />
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {imageFiles.map((img, index) => (
                                            <div key={index} className="position-relative">
                                                <img src={img.url} alt={img.fileName} width={100} />
                                                <Button
                                                    variant={img.fileId === defaultImageId ? "success" : "outline-secondary"}
                                                    className="position-absolute top-0 end-0"
                                                    size="sm"
                                                    onClick={() => handleSetDefaultImage(img.fileId)}
                                                >
                                                    {img.fileId === defaultImageId ? "Mặc định" : "Chọn làm mặc định"}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="secondary" onClick={onClose} className="me-2">Hủy bỏ</Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                Cập nhật địa điểm
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <div>Đang tải chi tiết địa điểm ...</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AUpdatePlacePage;