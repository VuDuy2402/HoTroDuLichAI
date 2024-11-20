import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { businessService } from "../../../services/businessService";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { CBusinessType, BusinessTypeDescriptions } from "../../../enum/businessTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import ErrorField from "@/common/components/ErrorField/ErrorField";

// LocationPicker Component
const LocationPicker = ({ setCoordinates, position }) => {
    useMapEvents({
        click({ latlng: { lat, lng } }) {
            setCoordinates({ latitude: lat, longitude: lng });
        },
    });

    return position ? (
        <Marker position={position}>
            <Popup>Nhấn chuột vào map để chọn địa điểm</Popup>
        </Marker>
    ) : null;
};

// ABusinessCreatePage Component
const ABusinessCreatePage = ({ show, onClose, onBusinessCreated }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [coordinates, setCoordinates] = useState({ latitude: 14.0583, longitude: 108.2772 });
    const [selectedBusinessype, setSelectedBusinessType] = useState(CBusinessType.None);
    const [imageFileIds, setImageFileIds] = useState([]);
    const [isNew, setIsNew] = useState(false);

    // Sync coordinates with form fields when they change
    useEffect(() => {
        setValue("latitude", coordinates.latitude);
        setValue("longitude", coordinates.longitude);
    }, [coordinates, setValue]);

    const handleLatLngChange = (e, type) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setCoordinates(prevState => ({ ...prevState, [type]: value }));
        }
    };

    const handleImagesUploaded = (fileId) => {
        setImageFileIds(prevFileIds => [...prevFileIds, fileId]);
    };

    const onSubmit = async (data) => {
        if (!coordinates.latitude || !coordinates.longitude) {
            toast.error("Vui lòng chọn một địa điểm trên Map.");
            return;
        }

        const createBusinessRequest = {
            name: data.name,
            description: data.description,
            address: data.address,
            isNew: isNew,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            businessType: selectedBusinessType,
            fileIds: imageFileIds,
        };

        try {
            dispatch({ type: "system/enableLoading" });

            const result = await business.createBusinessAdmin(createBusinessRequest);

            if (result && result.success) {
                toast.success("Thêm doanh nghiệp mới thành công.");
                onBusinessCreated();
                onClose();
            } else {
                toast.error(result?.errors || "Đã xảy ra lỗi khi thêm mới doanh nghiệp.");
            }
        } catch (error) {
            toast.error(`Lỗi khi đang tạo doanh nghiệp: ${error.message}`);
        } finally {
            dispatch({ type: "system/disableLoading" });
        }
    };


    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm doanh nghiệp mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup label="Tên doanh nghiệp" name="businessName" register={register} required />
                    <FormGroup label="Mô tả" name="description" register={register} required />
                    <FormSelect
                        label="Loại doanh nghiệp"
                        name="businessType"
                        value={selectedBusinessType}
                        onChange={e => setSelectedBussinessType(Number(e.target.value))}
                        options={Object.keys(CBusinessType).map(key => ({
                            value: CBusinessType[key],
                            label: BusinessTypeDescriptions[CBusinessType[key]],
                        }))}
                        register={register}
                        required
                    />
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập địa chỉ"
                            {...register("address", { required: "Địa chỉ là bắt buộc." })}
                        />
                        <ErrorField field={"Address_Error"} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Doanh nghiệp mới"
                            checked={isNew}
                            onChange={() => setIsNew(prev => !prev)}
                        />
                    </Form.Group>
                    <MapSection coordinates={coordinates} setCoordinates={setCoordinates} />
                    <ImageUploadSection onImagesUploaded={handleImagesUploaded} />
                    <ButtonGroup onClose={onClose} />
                </Form>
            </Modal.Body>
        </Modal>
    );
};

// Form Group Component for Input Fields
const FormGroup = ({ label, name, register, required }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
            type="text"
            placeholder={`Nhập ${label.toLowerCase()}`}
            {...register(name, { required: `${label} là bắt buộc.` })}
        />
        <ErrorField field={`${name}_Error`} />
    </Form.Group>
);

// Select Field Component for Dropdowns
const FormSelect = ({ label, name, value, onChange, options, register, required }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Select
            aria-label={`Chọn ${label.toLowerCase()}`}
            value={value}
            onChange={onChange}
            {...register(name, { required: `${label} là bắt buộc.` })}
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </Form.Select>
        <ErrorField field={`${name}_Error`} />
    </Form.Group>
);

// Map Section Component
const MapSection = ({ coordinates, setCoordinates }) => (
    <Form.Group className="mb-3">
        <Form.Label>Địa điểm</Form.Label>
        <div style={{ height: "300px" }}>
            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker setCoordinates={setCoordinates} position={[coordinates.latitude, coordinates.longitude]} />
            </MapContainer>
        </div>
        <div className="mt-2">
            <Form.Group className="d-flex">
                <Form.Label>Vĩ độ</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Latitude"
                    value={coordinates.latitude || ""}
                    onChange={e => handleLatLngChange(e, "latitude")}
                />
                <Form.Label>Kinh độ</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Longitude"
                    value={coordinates.longitude || ""}
                    onChange={e => handleLatLngChange(e, "longitude")}
                />
            </Form.Group>
        </div>
    </Form.Group>
);

// Image Upload Section Component
const ImageUploadSection = ({ onImagesUploaded }) => (
    <Form.Group className="mb-3">
        <Form.Label>Hình ảnh</Form.Label>
        <ImageUploadGallery onImagesUploaded={onImagesUploaded} />
    </Form.Group>
);

// Button Group Component
const ButtonGroup = ({ onClose }) => (
    <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
        <Button variant="primary" type="submit">Thêm doanh nghiệp mới</Button>
    </div>
);

export default ABusinessCreatePage;
