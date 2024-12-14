/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { articleService } from "../../../services/articleService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./ArticlePage.module.scss";
import { FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Input from "../../../common/components/Input/Input";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Paging from "../../../common/components/Paging/Paging";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
import useDocumentTitle from "../../../common/js/useDocumentTitle";

const ArticlePage = () => {
    const [listArticles, setListArticles] = useState([]);
    const dispatch = useDispatch();
    useDocumentTitle('Tin tức');

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

    // Fetch article data
    const getDataArticle = async () => {
        dispatch(systemAction.enableLoading());
        const result = await articleService.paging(dataSend);
        dispatch(systemAction.disableLoading());

        if (result) {
            if (result.success) {
                setListArticles(result.data.items);
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
        getDataArticle();
    }, [dataSend]);

    const handleSubmitFilter = (data) => {
        setDataSend(data);
    };

    return (
        <div className="container">
            <div className="list-intake container pt-3">
                <h4 className="text-success fw-bold" style={{ cursor: "pointer" }}>
                    Bài viết nổi bật
                </h4>
                <Toolbar
                    onChangeFilter={(value) => setDataSend(value)}
                    onSubmitFilter={handleSubmitFilter}
                />
                <Content items={listArticles} template={<ItemArticle />} />
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
                        placeholder="Tìm kiếm bài viết"
                        register={register}
                        className={"w-100"}
                        name={"searchQuery"}
                    />
                </div>
                <div className="col-12 col-md-4 p-1">
                    <Controller
                        name="filterProperty.articleType"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <Select
                                options={[]}
                                placeholder="Loại bài viết"
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

// Content component
const Content = ({ items, template }) => {
    const navigate = useNavigate();
    return (
        <div className="row">
            {items &&
                items.map((item, idx) => (
                    <div
                        key={idx}
                        className="col-12 col-md-6 col-lg-4 col-xl-3 p-2"
                        onClick={() => navigate(`/baiviet/chitiet/${item.articleId}`)}
                    >
                        {React.cloneElement(template, { data: item })}
                    </div>
                ))}
        </div>
    );
};

// ItemArticle component
const ItemArticle = ({ data }) => {
    const formattedDate = new Date(data.createdDate).toLocaleString("vi-VN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div
            className={`new-article-frame d-flex flex-column p-2 border p-2 ${styles.card}`}
            style={{
                height: "400px",
                backgroundImage: `url(${data.thumbnail})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                cursor: "pointer",
            }}
        >
            <div className="new-article-frame__content w-100 h-100 d-flex justify-content-center align-items-end">
                <div
                    className={`content-article w-100 p-2 d-flex flex-column align-items-center justify-content-center ${styles.contentArticle}`}
                >
                    <p
                        className="text-center text-white fw-bold fs-4 overflow-hidden m-0 d-flex gap-2 align-items-center justify-content-center"
                        style={{ height: "72px" }}
                    >
                        {data.title}
                    </p>
                    <div className={`text-white more-detail overflow-hidden w-100 ${styles.moreDetail}`}>
                        <p className="m-0 text-center">{data.author || "Chưa có tác giả"}</p>
                        <p className="d-flex gap-2 align-items-center justify-content-center m-0">
                            <FaUser />
                            {data.ownerProperty.fullName || "N/A"}
                        </p>
                        <p className="d-flex gap-2 align-items-center justify-content-center">
                            <FaEye />
                            {data.viewCount}
                        </p>
                        <p className="text-center text-white">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
