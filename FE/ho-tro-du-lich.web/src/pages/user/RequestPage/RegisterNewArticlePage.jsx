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
import { imageKitService } from "../../../services/imageKitService";

// Các tùy chọn cho loại bài viết và trạng thái phê duyệt
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
    const quillRef = useRef(null);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        type: { value: 0, label: "Không xác định" },
        approved: { value: 0, label: "Không xác định" },
        images: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption,
        }));
    };

    const handleEditorChange = (value) => {
        // setFormData((prevData) => ({
        //     ...prevData,
        //     content: value,
        // }));
    };

    const handleImageUpload = async (files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("Files", files[i]);
        }

        try {
            const accessToken = localStorageService.getAccessToken();
            const response = await axios.post(
                'https://localhost:7001/api/v1/admin/fileupload/imagekit/bulkupload',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            if (response && response.data) {
                if (response.data.success) {
                    const imageUrls = response.data.data.imageInfos.map(img => img.fileUrl);
                    return imageUrls;
                } else if (response.errors) {
                    setErrors(response.errors);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrors(['Error uploading image']);
        }

        return null;
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', 'true');
        input.click();

        input.onchange = async (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const imageUrls = await handleImageUpload(files);

                if (imageUrls) {
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();

                    if (range) {
                        imageUrls.forEach(imageUrl => {
                            editor.insertEmbed(range.index, 'image', imageUrl);
                        });

                        const newRange = range.index + imageUrls.length;
                        editor.setSelection(newRange);
                    } else {
                        const length = editor.getLength();
                        imageUrls.forEach(imageUrl => {
                            editor.insertEmbed(length, 'image', imageUrl);
                        });
                    }
                }
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'align': [] }],
                ['link', 'image'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            type: formData.type.value,
            approved: formData.approved.value,
        };

        try {
            dispatch(systemAction.enableLoading());
            const result = await articleService.registerNewArticle(data);
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
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <ErrorField errorList={errors} field="Title_Error" />
                </Form.Group>

                <Form.Group controlId="content">
                    <Form.Label>Nội dung</Form.Label>
                    <ReactQuill
                        value={formData.content}
                        onChange={handleEditorChange}
                        ref={quillRef}
                        theme="snow"
                        modules={modules}
                    />
                    <ErrorField errorList={errors} field="Content_Error" />
                </Form.Group>

                <Form.Group controlId="author">
                    <Form.Label>Tác giả</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                    />
                    <ErrorField errorList={errors} field="Author_Error" />
                </Form.Group>

                <Form.Group controlId="type">
                    <Form.Label>Loại bài viết</Form.Label>
                    <Select
                        name="type"
                        value={formData.type}
                        options={articleTypeOptions}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "type")}
                    />
                    <ErrorField errorList={errors} field="Type_Error" />
                </Form.Group>

                <Form.Group controlId="approved">
                    <Form.Label>Trạng thái phê duyệt</Form.Label>
                    <Select
                        name="approved"
                        value={formData.approved}
                        options={approvalTypeOptions}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "approved")}
                    />
                    <ErrorField errorList={errors} field="Approved_Error" />
                </Form.Group>

                <ImageUploadGallery
                    label="Hình ảnh bài viết"
                    onImagesUploaded={(data) => setFormData((prevData) => ({ ...prevData, images: data }))}
                    onImagesRemove={() => setFormData((prevData) => ({ ...prevData, images: [] }))}
                    multiple={true}
                />
                <ErrorField errorList={errors} field="Images_Error" />

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="light" type="button" onClick={() => navigate("/articles")}>
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