import { useEffect, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { articleService } from "../../../services/articleService";
import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { CArticleType, CArticleTypeDescriptions } from "../../../enum/articleTypeEnum";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import Select from "react-select";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const articleTypeOptions = Object.keys(CArticleType).map((key) => ({
  label: CArticleTypeDescriptions[CArticleType[key]],
  value: CArticleType[key],
}));

const approvalTypeOptions = Object.keys(CApprovalType).map((key) => ({
  label: ApprovalTypeDescriptions[CApprovalType[key]],
  value: CApprovalType[key],
}));

const AUpdateArticlePage = ({ show, onClose, articleId, onArticleUpdated }) => {
  const quillRef = useRef();
  const titleRef = useRef();
  const authorRef = useRef();
  const [imageFileIds, setImageFileIds] = useState([]);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    type: { value: 0, label: "Không xác định" },
    approved: { value: 0, label: "Không xác định" },
    thumbnailFileId: "",
  });

  useEffect(() => {
    if (articleId) {
      const fetchArticleData = async () => {
        try {
          const response = await articleService.getArticleDetailById(articleId);
          if (response && response.success) {
            const article = response.data;
            setFormData({
              title: article.title,
              content: article.content,
              author: article.author,
              type: { value: article.type, label: CArticleTypeDescriptions[article.type] },
              approved: { value: article.approved, label: ApprovalTypeDescriptions[article.approved] },
              thumbnailFileId: article.thumbnailFileId,
            });
            setImageFileIds([article.thumbnailFileId]);
          } else {
            setErrors(response.errors);
          }
        } catch (error) {
          toast.error(`Error fetching article: ${error}`);
        }
      };
      fetchArticleData();
    }
  }, [articleId]);

  const handleUploadThumbnail = (fileId) => {
    setImageFileIds([fileId]);
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
      if (response && response.data.success) {
        const imageUrls = response.data.data.imageInfos.map((img) => img.url);
        const editor = quillRef.current.getEditor();
        imageUrls.forEach((url) => {
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", url);
        });
      } else {
        setErrors(response.data.errors);
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
      const result = await articleService.updateArticle(articleId, requestData);
      if (result.success) {
        if (onArticleUpdated) {
          onArticleUpdated(result.data);
        }
        onClose();
      } else {
        setErrors(result.errors);
      }
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div className={`update-article p-2 container ${show ? "show" : ""}`}>
      <h4>Cập Nhật Bài Viết</h4>
      <Form onSubmit={handleSubmitForm}>
        <FormErrorAlert errors={errors} />

        <h5>Thông Tin Bài Viết</h5>

        <Form.Group controlId="title">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            name="title"
            ref={titleRef}
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />
          <ErrorField errorList={errors} field="Title_Error" />
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>Nội dung</Form.Label>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            value={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
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
            value={formData.author}
            onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
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
          <Button variant="light" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="success" type="submit">
            Cập Nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AUpdateArticlePage;