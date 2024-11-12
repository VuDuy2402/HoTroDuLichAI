import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { placeService } from "../../../services/placeService";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import Input from "../../../common/components/Input/Input";

// Custom hook to handle map clicks
const LocationPicker = ({ setCoordinates, position }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ latitude: lat, longitude: lng });
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Click to set the location</Popup>
    </Marker>
  ) : null;
};

const APlaceCreatePage = ({ show, onClose, onPlaceCreated }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [coordinates, setCoordinates] = useState({
    latitude: 14.0583,
    longitude: 108.2772,
  });
  const [selectedPlaceType, setSelectedPlaceType] = useState(CPlaceType.None);
  const [imageFileIds, setImageFileIds] = useState([]);

  // Update the map when coordinates change
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      // Manually set the form fields for latitude and longitude
      setValue("latitude", coordinates.latitude);
      setValue("longitude", coordinates.longitude);
    }
  }, [coordinates, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!coordinates.latitude || !coordinates.longitude) {
      toast.error("Please select a location on the map.");
      return;
    }

    const placeData = {
      ...data,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      placeType: selectedPlaceType,
      imageGallery: JSON.stringify(imageFileIds),
    };

    try {
      dispatch({ type: "system/enableLoading" }); // Show loading
      const result = await placeService.createPlace(placeData);

      if (result && result.success) {
        toast.success("Place created successfully!");
        onPlaceCreated();
        onClose();
      } else {
        toast.error("Failed to create the place.");
      }
    } catch (error) {
      toast.error("Error creating place: " + error.message);
    } finally {
      dispatch({ type: "system/disableLoading" });
    }
  };

  // Handle manual input change for latitude and longitude
  const handleLatLngChange = (e, type) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setCoordinates((prevState) => ({
        ...prevState,
        [type]: value,
      }));
    }
  };

  // Handle image upload
  const handleImagesUploaded = (fileId) => {
    setImageFileIds((prevFileIds) => [...prevFileIds, fileId]);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Place</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Input
              type="text"
              placeholder="Enter place name"
              register={register}
              name={"name"}
              label={"Place Name"}
              classLabel={"text-black"}
              validate={{ required: "Place name is required" }}
            />
            {errors && errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Input
              label={"Description"}
              type="text"
              placeholder="Enter description"
              register={register}
              name={"description"}
              validate={{ required: "Description is required." }}
            />
            {/* <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              {...register("description", {
                required: "Description is required",
              })}
            /> */}
            {errors && errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Place Type</Form.Label>
            <Form.Select
              aria-label="Select Place Type"
              value={selectedPlaceType}
              onChange={(e) => setSelectedPlaceType(Number(e.target.value))}
              {...register("placeType", { required: "Place type is required" })}
            >
              {Object.keys(CPlaceType).map((key) => {
                const value = CPlaceType[key];
                const description = PlaceTypeDescriptions[value];
                return (
                  <option key={value} value={value}>
                    {description}
                  </option>
                );
              })}
            </Form.Select>
            {errors.placeType && (
              <div className="text-danger">{errors.placeType.message}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <div style={{ height: "300px" }}>
              <MapContainer
                center={[coordinates.latitude, coordinates.longitude]} // Ensure valid coordinates
                zoom={8}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker
                  setCoordinates={setCoordinates}
                  position={[coordinates.latitude, coordinates.longitude]}
                />
              </MapContainer>
            </div>
            <div className="mt-2">
              <Form.Group className="d-flex">
                <Form.Control
                  type="number"
                  placeholder="Latitude"
                  value={coordinates.latitude || ""}
                  onChange={(e) => handleLatLngChange(e, "latitude")}
                />
                <Form.Control
                  type="number"
                  placeholder="Longitude"
                  value={coordinates.longitude || ""}
                  onChange={(e) => handleLatLngChange(e, "longitude")}
                />
              </Form.Group>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <ImageUploadGallery onImagesUploaded={handleImagesUploaded} />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create Place
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default APlaceCreatePage;
