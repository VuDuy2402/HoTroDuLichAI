/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { placeService } from "../../../services/placeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./PlacePage.module.scss";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import { FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Input from "../../../common/components/Input/Input";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Paging from "../../../common/components/Paging/Paging";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
const PlacePage = () => {
  const [listPlaces, setListPlaces] = useState([]);
  const dispatch = useDispatch();
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const [dataSend, setDataSend] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchQuery: "",
    filterProperty: {},
    sortProperty: {},
  });
  const navigate = useNavigate();
  const getDataPlace = async () => {
    dispatch(systemAction.enableLoading());
    const result = await placeService.getWithPaging(dataSend);
    dispatch(systemAction.disableLoading());
    if (result) {
      if (result.success) {
        setListPlaces(result.data.items);
        setPagingData({
          currentPage: result.data.currentPage,
          total: result.data.totalPages,
          pageSize: result.data.pageSize,
        });
      } else {
        toast.error("Xảy ra lỗi");
      }
    } else {
      navigate("/error");
    }
  };
  useEffect(() => {
    getDataPlace();
  }, [dataSend]);

  const handleSubmitFilter = (data) => {
    setDataSend(data);
  };

  return (
    <div className="container">
      <div className="list-intake container pt-3">
        <h4 className="text-success fw-bold" style={{ cursor: "pointer" }}>
          Địa điểm nổi tiếng
        </h4>
        <Toolbar
          onChangeFilter={(value) => setDataSend(value)}
          onSubmitFilter={handleSubmitFilter}
        />
        <Content items={listPlaces} template={<ItemPlace />} />
        <Paging
          classActive={"bg-success text-white"}
          data={pagingData}
          onChange={(page) =>
            setDataSend((pre) => ({ ...pre, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

const Toolbar = ({ onSubmitFilter }) => {
  const { register, handleSubmit, control } = useForm();
  const options = Object.keys(CPlaceType).map((key) => ({
    label: PlaceTypeDescriptions[CPlaceType[key]],
    value: CPlaceType[key],
  }));
  const handleSubmitFilter = (data) => {
    data.pageNumber = 1;
    data.pageSize = 10;
    data.sortProperty = {};
    onSubmitFilter(data);
  };
  return (
    <form onSubmit={handleSubmit(handleSubmitFilter)}>
      <div className="row">
        <div className="col-12 col-md-6 p-1">
          <Input
            placeholder="Tìm kiếm địa điểm"
            register={register}
            className={"w-100"}
            name={"searchQuery"}
          />
        </div>
        <div className="col-12 col-md-4 p-1">
          <Controller
            name="filterProperty.placeType"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Select
                options={options}
                placeholder="Loại địa điểm"
                onChange={(selectedOption) =>
                  field.onChange(selectedOption ? selectedOption.value : "")
                }
              />
            )}
          />
        </div>
        <div className="col-12 col-md-2 p-1">
          <button type="submit" className="btn btn-success w-100">
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
};

const Content = ({ items, template }) => {
  const navigate = useNavigate();
  return (
    <div className="row">
      {items &&
        items.map((item, idx) => (
          <div
            key={idx}
            className="col-12 col-md-6 col-lg-4 col-xl-3 p-2"
            onClick={() => navigate(`/diadiem/${item.placeId}`)}
          >
            {React.cloneElement(template, { data: item })}
          </div>
        ))}
    </div>
  );
};

const ItemPlace = ({ data }) => {
  return (
    <div
      className={`new-place-frame d-flex flex-column p-2 border p-2 ${styles.card}`}
      style={{
        height: "400px",
        backgroundImage: `url(${data.thumbnail})`,
        backgroundPosition: "center",
        cursor: "pointer",
      }}
    >
      <div className="new-place-frame__content w-100 h-100 d-flex justify-content-center align-items-end">
        <div
          className={`content-place w-100 p-2 d-flex flex-column align-items-center justify-content-center ${styles.contentPlace}`}
        >
          <p
            className="text-center text-white fw-bold fs-4 overflow-hidden m-0 d-flex gap-2 align-items-center justify-content-center"
            style={{ height: "72px" }}
          >
            {data.name}
          </p>
          <div
            className={`text-white more-detail overflow-hidden w-100 ${styles.moreDetail}`}
          >
            <p className="m-0 text-center">
              {PlaceTypeDescriptions[data.placeType]}
            </p>
            <p className="d-flex gap-2 align-items-center justify-content-center m-0">
              <FaStar />
              {data.rating}
            </p>
            <p className="d-flex gap-2 align-items-center justify-content-center">
              <FaEye />
              {data.totalView}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
