// import { useEffect, useState, useRef } from "react";
// import { Form, Button, Modal, Row, Col } from "react-bootstrap";
// import { articleService } from "../../../services/articleService";
// import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
// import { CArticleType, CArticleTypeDescriptions } from "../../../enum/articleTypeEnum";
// import { toast } from "react-toastify";
// import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
// import ErrorField from "@/common/components/ErrorField/ErrorField";
// import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
// import ReactQuill from 'react-quill';
// import "react-quill/dist/quill.snow.css";
// import axios from "axios";

// const AUpdateArticlePage = ({ show, onClose, articleId, onArticleUpdated }) => {
//   const quillRef = useRef();
//   const [imageFileIds, setImageFileIds] = useState([]);
//   const [errors, setErrors] = useState([]);
//   const [selectedArticleType, setSelectedArticleType] = useState(CArticleType.None);
//   const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(CApprovalType.None);
//   const [articleDetail, setArticleDetail] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     author: "",
//     type: { value: 0, label: "Không xác định" },
//     approved: { value: 0, label: "Không xác định" },
//     thumbnailFileId: "",
//   });

//   useEffect(() => {
//     if (articleId) {
//       const fetchArticleData = async () => {
//         try {
//           const response = await articleService.getArticleDetailById(articleId);
//           if (response && response.success) {
//             const article = response.data;
//             setArticleDetail(response.data);
//             setFormData({
//               title: article.title,
//               content: article.content,
//               author: article.author,
//               thumbnailFileId: article.thumbnailFileId,
//             });
//             setSelectedArticleType(article.articleType || CArticleType.None),
//               setSelectedApprovalStatus(article.approvalType || CApprovalType.None),
//               setImageFileIds([article.thumbnailFileId]);
//           } else {
//             setErrors(response.errors);
//           }
//         } catch (error) {
//           toast.error(`Error fetching article: ${error}`);
//         }
//       };
//       fetchArticleData();
//     }
//   }, [articleId]);

//   const handleUploadThumbnail = (fileId) => {
//     setImageFileIds([fileId]);
//   };

//   const handleImageUpload = async (files) => {
//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("Files", files[i]);
//     }

//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.post(
//         "https://localhost:7001/api/v1/admin/fileupload/imagekit/bulkupload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       if (response && response.data.success) {
//         const imageUrls = response.data.data.imageInfos.map((img) => img.url);
//         const editor = quillRef.current.getEditor();
//         imageUrls.forEach((url) => {
//           const range = editor.getSelection();
//           editor.insertEmbed(range.index, "image", url);
//         });
//       } else {
//         setErrors(response.data.errors);
//       }
//     } catch (error) {
//       if (error.response) {
//         setErrors(error.response.data.errors);
//       } else {
//         toast.error(`Error uploading image:  ${error}`);
//       }
//     }
//   };

//   const imageHandler = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     input.onchange = async () => {
//       const files = input.files;
//       if (files) {
//         await handleImageUpload(files);
//       }
//     };
//   };

//   const modules = {
//     toolbar: {
//       container: [
//         [{ header: "1" }, { header: "2" }, { font: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["bold", "italic", "underline"],
//         ["link", "image"],
//         [{ align: [] }],
//         [{ color: [] }, { background: [] }],
//         ["blockquote", "code-block"],
//       ],
//       handlers: {
//         image: () => imageHandler(),
//       },
//     },
//   };

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();
//     const editor = quillRef.current.getEditor();
//     const content = editor.root.innerHTML;
//     const requestData = {
//       articleId: articleDetail.articleDetail,
//       title: formData.title,
//       content: content,
//       author: formData.author,
//       articleType: formData.type.value,
//       approvalType: formData.approved.value,
//       thumbnailFileId: imageFileIds[0],
//     };

//     try {
//       const result = await articleService.updateArticleByAdmin(requestData);
//       if (result.success) {
//         if (onArticleUpdated) {
//           onArticleUpdated(result.data);
//         }
//         onClose();
//       } else {
//         setErrors(result.errors);
//       }
//     } catch (err) {
//       toast.error(`Error: ${err}`);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onClose} size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Cập Nhật Bài Viết</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmitForm}>
//           <FormErrorAlert errors={errors} />
//           <h5>Thông Tin Bài Viết</h5>

//           <Form.Group className="mb-3" controlId="title">
//             <Form.Label>Tiêu đề</Form.Label>
//             <Form.Control
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//             />
//             <ErrorField errorList={errors} field="Title_Error" />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="content">
//             <Form.Label>Nội dung</Form.Label>
//             <ReactQuill
//               ref={quillRef}
//               modules={modules}
//               value={formData.content}
//               onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
//               placeholder="Nhập nội dung cho bài viết của bạn..."
//               theme="snow"
//             />
//             <ErrorField errorList={errors} field="Content_Error" />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="author">
//             <Form.Label>Bí danh</Form.Label>
//             <Form.Control
//               type="text"
//               name="author"
//               value={formData.author}
//               onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
//             />
//             <ErrorField errorList={errors} field="Author_Error" />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="type">
//             <Form.Label>Loại bài viết</Form.Label>
//             <Form.Select
//               value={selectedArticleType}
//               onChange={(e) => {
//                 const newValue = Number(e.target.value);
//                 setSelectedArticleType(newValue);
//                 setValue("articleType", newValue);
//               }}
//             >
//               {Object.keys(CArticleType).map(key => (
//                 <option key={key} value={CArticleType[key]}>
//                   {CArticleTypeDescriptions[CArticleType[key]]}
//                 </option>
//               ))}
//             </Form.Select>
//             <ErrorField errorList={errors} field="Type_Error" />
//           </Form.Group>

//           <Form.Group controlId="approved">
//             <Form.Label>Trạng thái phê duyệt</Form.Label>
//             <Form.Select
//               value={selectedApprovalStatus}
//               onChange={(e) => {
//                 const newValue = Number(e.target.value);
//                 setSelectedApprovalStatus(newValue);
//                 setValue("approved", newValue);
//               }}
//             >
//               {Object.keys(CApprovalType).map(key => (
//                 <option key={key} value={CApprovalType[key]}>
//                   {ApprovalTypeDescriptions[CApprovalType[key]]}
//                 </option>
//               ))}
//             </Form.Select>
//             <ErrorField errorList={errors} field="Approved_Error" />
//           </Form.Group>

//           {articleDetail && articleDetail.thumbnail && (
//             <Row className="my-3">
//               <Col>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Hình ảnh</Form.Label>
//                   <ImageUploadGallery onImagesUploaded={handleUploadThumbnail} />
//                   <ErrorField errorList={errors} field="Thumbnail_Error" />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group>
//                   <div>
//                     <img
//                       src={articleDetail.thumbnail}
//                       alt="Thumbnail"
//                       style={{
//                         maxWidth: "200px",
//                         maxHeight: "200px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                       }}
//                     />
//                   </div>
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}

//           <div className="d-flex justify-content-end gap-2 mt-3">
//             <Button variant="light" type="button" onClick={onClose}>
//               Hủy
//             </Button>
//             <Button variant="success" type="submit">
//               Cập Nhật
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AUpdateArticlePage;




import { useEffect, useState, useRef, useCallback } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import { articleService } from "../../../services/articleService";
import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { CArticleType, CArticleTypeDescriptions } from "../../../enum/articleTypeEnum";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const AUpdateArticlePage = ({ show, onClose, articleId, onArticleUpdated }) => {
  const quillRef = useRef();
  const [imageFileIds, setImageFileIds] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedArticleType, setSelectedArticleType] = useState(CArticleType.None);
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(CApprovalType.None);
  const [articleDetail, setArticleDetail] = useState(null);
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
            setArticleDetail(response.data);
            setFormData({
              title: article.title,
              content: article.content,
              author: article.author,
              thumbnailFileId: article.thumbnailFileId,
            });
            setSelectedArticleType(article.articleType || CArticleType.None);
            setSelectedApprovalStatus(article.approvalType || CApprovalType.None);
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

  const handleImageUpload = useCallback(async (files) => {
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
        toast.error(`Error uploading image: ${error}`);
      }
    }
  }, []);

  const imageHandler = useCallback(() => {
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
  }, [handleImageUpload]);

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
        image: imageHandler,
      },
    },
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const editor = quillRef.current.getEditor();
    const content = editor.root.innerHTML;
    
    const requestData = {
      articleId: articleDetail.articleId,
      title: formData.title,
      content: content,
      author: formData.author,
      articleType: selectedArticleType,
      approvalType: selectedArticleType,
      thumbnailFileId: imageFileIds[0],
    };

    try {
      const result = await articleService.updateArticleByAdmin(requestData);
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
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập Nhật Bài Viết</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitForm}>
          <FormErrorAlert errors={errors} />
          <h5>Thông Tin Bài Viết</h5>

          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
            <ErrorField errorList={errors} field="Title_Error" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="content">
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

          <Form.Group className="mb-3" controlId="author">
            <Form.Label>Bí danh</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
            />
            <ErrorField errorList={errors} field="Author_Error" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="type">
            <Form.Label>Loại bài viết</Form.Label>
            <Form.Select
              value={selectedArticleType}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setSelectedArticleType(newValue);
                setFormData((prev) => ({ ...prev, type: { value: newValue, label: CArticleTypeDescriptions[newValue] } }));
              }}
            >
              {Object.keys(CArticleType).map(key => (
                <option key={key} value={CArticleType[key]}>
                  {CArticleTypeDescriptions[CArticleType[key]]}
                </option>
              ))}
            </Form.Select>
            <ErrorField errorList={errors} field="Type_Error" />
          </Form.Group>

          <Form.Group controlId="approved">
            <Form.Label>Trạng thái phê duyệt</Form.Label>
            <Form.Select
              value={selectedApprovalStatus}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setSelectedApprovalStatus(newValue);
                setFormData((prev) => ({ ...prev, approved: { value: newValue, label: ApprovalTypeDescriptions[newValue] } }));
              }}
            >
              {Object.keys(CApprovalType).map(key => (
                <option key={key} value={CApprovalType[key]}>
                  {ApprovalTypeDescriptions[CApprovalType[key]]}
                </option>
              ))}
            </Form.Select>
            <ErrorField errorList={errors} field="Approved_Error" />
          </Form.Group>

          {articleDetail && articleDetail.thumbnail && (
            <Row className="my-3">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh</Form.Label>
                  <ImageUploadGallery onImagesUploaded={handleUploadThumbnail} />
                  <ErrorField errorList={errors} field="Thumbnail_Error" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <div>
                    <img
                      src={articleDetail.thumbnail}
                      alt="Thumbnail"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          )}

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="light" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="success" type="submit">
              Cập Nhật
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AUpdateArticlePage;