import { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { articleService } from "../../../services/articleService";
import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { CArticleType, CArticleTypeDescriptions } from "../../../enum/articleTypeEnum";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import { toQueryString } from "../../../utils/queryParams";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import axios from "axios";

const articleTypeOptions = Object.keys(CArticleType).map((key) => ({
    label: CArticleTypeDescriptions[CArticleType[key]],
    value: CArticleType[key],
}));

const approvalTypeOptions = Object.keys(CApprovalType).map((key) => ({
    label: ApprovalTypeDescriptions[CApprovalType[key]],
    value: CApprovalType[key],
}));

const RegisterNewArticlePage = () => {
    const navigate = useNavigate();
    const quillRef = useRef();
    const titleRef = useRef();
    const authorRef = useRef();
    const [imageFileIds, setImageFileIds] = useState([]);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    useDocumentTitle('Đăng bài viết')
    
    const initialFormData = {
        title: "",
        content: "",
        author: "",
        type: { value: 0, label: "Không xác định" },
        approved: { value: 0, label: "Không xác định" },
        thumbnailFileId: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleUploadThumbnail = (fileId) => {
        setImageFileIds((prevFileIds) => [...prevFileIds, fileId]);
    };

    const handleImageUpload = async (files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("Files", files[i]);
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(
                "https://localhost:7001/api/v1/admin/fileupload/imagekit/bulkupload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response && response.data) {
                if (response.data.success) {
                    const imageUrls = response.data.data.imageInfos.map((img) => img.url);
                    const editor = quillRef.current.getEditor();
                    imageUrls.forEach((url) => {
                        const range = editor.getSelection();
                        editor.insertEmbed(range.index, "image", url);
                    });
                } else if (response.data.errors) {
                    setErrors(response.data.errors);
                }
            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(`Error uploading image:  ${error}`);
            }
        }
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const files = input.files;
            if (files) {
                await handleImageUpload(files);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                ["link", "image"],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ["blockquote", "code-block"],
            ],
            handlers: {
                image: () => imageHandler(),
            },
        },
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const editor = quillRef.current.getEditor();
        const content = editor.root.innerHTML;

        const title = titleRef.current.value; 
        const author = authorRef.current.value;

        if (!title || !author) {
            toast.error("Title and Author are required.");
            return;
        }

        const requestData = {
            title: title,
            content: content,
            author: author,
            type: formData.type.value,
            approved: formData.approved.value,
            thumbnailFileId: imageFileIds[0],
        };

        try {
            dispatch(systemAction.enableLoading());
            const result = await articleService.registerNewArticle(requestData);
            if (result) {
                if (result.success) {
                    const queryString = toQueryString(result.data || {});
                    navigate(`/thongbao/?${queryString}`);
                } else if (result.errors) {
                    setErrors(result.errors);
                }
            } else {
                toast.error("Không thể kết nối đến server.");
            }
        } catch (err) {
            toast.error(`Đã có lỗi xảy ra: ${err}`);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    return (
        <div className="register-new-article p-2 container">
            <h4>Đăng Ký Bài Viết Mới</h4>
            <Form onSubmit={handleSubmitForm}>
                <FormErrorAlert errors={errors} />

                <h5>Thông Tin Bài Viết</h5>

                <Form.Group controlId="title">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        ref={titleRef}  // Assign ref to title input
                        defaultValue={formData.title}
                    />
                    <ErrorField errorList={errors} field="Title_Error" />
                </Form.Group>

                <Form.Group controlId="content">
                    <Form.Label>Nội dung</Form.Label>
                    <ReactQuill
                        ref={quillRef}
                        modules={modules}
                        defaultValue={formData.content}
                        placeholder="Nhập nội dung cho bài viết của bạn..."
                        theme="snow"
                    />
                    <ErrorField errorList={errors} field="Content_Error" />
                </Form.Group>

                <Form.Group controlId="author">
                    <Form.Label>Bí danh</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        ref={authorRef}
                        defaultValue={formData.author}
                    />
                    <ErrorField errorList={errors} field="Author_Error" />
                </Form.Group>

                <Form.Group controlId="type">
                    <Form.Label>Loại bài viết</Form.Label>
                    <Select
                        name="type"
                        value={formData.type}
                        options={articleTypeOptions}
                        onChange={(selectedOption) => setFormData((prevData) => ({ ...prevData, type: selectedOption }))}
                    />
                    <ErrorField errorList={errors} field="Type_Error" />
                </Form.Group>

                <Form.Group controlId="approved">
                    <Form.Label>Trạng thái phê duyệt</Form.Label>
                    <Select
                        name="approved"
                        value={formData.approved}
                        options={approvalTypeOptions}
                        onChange={(selectedOption) => setFormData((prevData) => ({ ...prevData, approved: selectedOption }))}
                    />
                    <ErrorField errorList={errors} field="Approved_Error" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hình ảnh</Form.Label>
                    <ImageUploadGallery onImagesUploaded={handleUploadThumbnail} />
                    <ErrorField errorList={errors} field="Thumbnail_Error" />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="light" type="button" onClick={() => navigate("/")}>
                        Hủy
                    </Button>
                    <Button variant="success" type="submit">
                        Gửi Yêu Cầu
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RegisterNewArticlePage;