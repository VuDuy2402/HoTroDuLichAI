import React, { useCallback, useEffect, useState } from "react";
import Paging from "../Paging/Paging";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { IoFilter } from "react-icons/io5";
import Panel from "../Panel/Panel";
const ListCard = ({
  titlePanel,
  rowTemplate,
  items,
  page,
  filter,
  onChange,
  onSubmit,
  status,
  onChangeStatusPanel,
}) => {
  const { register, handleSubmit } = useForm();
  const handleSubmitForm = useCallback((data) => {
    const dataSend = {
      pageNumber: page.currentPage,
      pageSize: 10,
      searchQuery: data.searchQuery,
    };
    onSubmit(dataSend);
  }, []);

  return (
    <div className="frame-list-card">
      <div className="frame-list-card__header">
        <h3 className="fw-bold text-warning">Danh sách khoá học</h3>
      </div>
      <div className="tool-frame">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="d-flex justify-content-start flex-wrap gap-2"
        >
          <div className="tool-frame__search w-50 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Nhập thông tin khoá học"
              {...register("searchQuery")}
            />
            <button className="btn btn-warning" type="submit">
              <FaSearch />
            </button>
          </div>
          <div className="tool-frame__other">
            <button
              type="button"
              className="btn btn-outline-secondary btn-filter"
              onClick={() => onChangeStatusPanel("open")}
            >
              <IoFilter />
            </button>
          </div>
        </form>
      </div>
      <div className="list-item row g-2 pt-3">
        {items &&
          items.map((item) =>
            React.cloneElement(rowTemplate, {
              key: item.courseIntakeId,
              data: item,
            })
          )}
      </div>
      <Panel
        title={titlePanel}
        status={status ? true : false}
        bodyContent={filter}
        onClose={() => onChangeStatusPanel("close")}
      />
      {page && <Paging data={page} onChange={onChange} />}
    </div>
  );
};

export default ListCard;
