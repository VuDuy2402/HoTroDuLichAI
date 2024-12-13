import { useState, useEffect } from "react";
import { reviewPlaceService } from "../../../services/reviewPlaceService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { toast } from "react-toastify";
import {
    Form,
    Button,
    Card,
    Spinner,
    Container,
    Row,
    Col,
    Modal,
} from "react-bootstrap";
import Paging from "../../../common/components/Paging/Paging";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";

const ReviewTab = ({ placeId, rating }) => {
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [pagingData, setPagingData] = useState({
        currentPage: 1,
        total: 1,
        pageSize: 10,
    });

    const [pagination, setPagination] = useState({
        searchQuery: "",
        filterProperty: null,
        sortProperty: null,
        pageNumber: 1,
        pageSize: 10,
    });

    const handleFetchReviews = async () => {
        setIsLoading(true);
        const result = await reviewPlaceService.getReviewOfPlaceWithPaging(
            placeId,
            pagination
        );
        setIsLoading(false);

        if (result && result.success) {
            setReviews(result.data.items);
            setPagingData({
                currentPage: result.data.currentPage,
                total: result.data.totalPages,
                pageSize: result.data.pageSize,
            });
        } else if (result && result.errors) {
            setErrors(result.errors);
        }
    };

    useEffect(() => {
        handleFetchReviews();
    }, [placeId, pagination]);

    const handleChangePage = (page) => {
        setPagination({ ...pagination, pageNumber: page });
    };

    const handleSubmitReview = async () => {
        const result = await reviewPlaceService.createReviewOfPlace({
            comment: newComment,
            rating: selectedRating,
            placeId: placeId,
        });

        if (result && result.success) {
            toast.success(result.data.message);
            setNewComment("");
            handleFetchReviews();
        } else if (result && result.errors) {
            setErrors(result.errors);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const result = await reviewPlaceService.deleteReviewOfPlace(reviewId);

        if (result && result.success) {
            toast.success("Đã xóa bình luận thành công!");
            handleFetchReviews();
        } else {
            toast.error("Không thể xóa bình luận.");
        }
    };

    const handleShowModal = (review) => {
        setShowModal(true);
        setSelectedReview(review);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReview(null);
    };

    const handleDelete = async () => {
        if (selectedReview) {
            await handleDeleteReview(selectedReview.reviewPlaceId);
            setShowModal(false);
            setSelectedReview(null);
        }
    };

    const handleEditToggle = (review) => {
        setEditingContent(review.comment);
        setIsEditing(true);
        setSelectedReview(review);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingContent("");
    };

    const handleSaveEdit = async () => {
        if (selectedReview) {
            const data = {
                placeId: selectedReview.placeId,
                comment: editingContent,
                rating: selectedReview.rating,
                reviewPlaceId: selectedReview.reviewPlaceId
            };
    
            const result = await reviewPlaceService.updateReviewOfPlace(data);
    
            if (result && result.success) {
                toast.success(result.data.message);
                setIsEditing(false);
                setEditingContent("");
                handleFetchReviews();
            } else if (result && result.errors) {
                setErrors(result.errors);
            }
        }
    };

    const renderStars = (currentRating, isInteractive = false) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            let starStyle = {
                color: "text-muted",
                cursor: isInteractive ? "pointer" : "default",
            };

            if (isInteractive) {
                if (i <= selectedRating) {
                    starStyle = { color: "gold", cursor: "pointer" };
                }
            } else {
                if (currentRating >= i) {
                    starStyle = { color: "gold" };
                } else if (currentRating >= i - 0.5) {
                    starStyle = {
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%)",
                        color: "gold",
                    };
                }
            }

            stars.push(
                <FaStar
                    key={i}
                    style={starStyle}
                    onClick={() => isInteractive && setSelectedRating(i)}
                />
            );
        }

        return stars;
    };




    return (
        <Container className="py-4">
            <FormErrorAlert errors={errors} />
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center mb-3">
                    <span className="fw-bold me-2">Điểm đánh giá chung:</span>
                    {renderStars(rating)}
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span className="fw-bold me-2">Đánh giá của bạn : </span>
                    {renderStars(5, true)}
                </div>
            </div>
            <Card className="mb-4">
                <Card.Body>
                    <Form>
                        <Form.Group controlId="commentInput">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Thêm bình luận của bạn..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-2" onClick={handleSubmitReview}>
                            Gửi bình luận
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {isLoading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Card className="mb-3" key={review.reviewPlaceId}>
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-center">
                                            <img
                                                src={review.ownerProperty.avatar || "https://via.placeholder.com/48"}
                                                alt={review.ownerProperty.fullName}
                                                className="rounded-circle"
                                                style={{ width: "48px", height: "48px" }}
                                            />
                                        </Col>
                                        <Col xs={10}>
                                            <div className="mb-2">
                                                <span className="fw-bold">{review.ownerProperty.fullName}</span>
                                                <div className="d-flex justify-content-between m-0">
                                                    <p className="text-muted m-0">
                                                        {new Date(review.createdDate).toLocaleDateString()}{" "}
                                                    </p>
                                                    {review.isOwner && (
                                                        <div>
                                                            <a
                                                                href="#"
                                                                className="btn btn-sm btn-outline-secondary border-0"
                                                                onClick={() => handleEditToggle(review)}
                                                            >
                                                                <FaEdit className="mx-2" />
                                                            </a>
                                                            <a
                                                                href="#"
                                                                className="btn btn-sm btn-outline-danger border-0"
                                                                onClick={() => handleShowModal(review)}
                                                            >
                                                                <FaTrash />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {isEditing && review.reviewPlaceId === selectedReview?.reviewPlaceId ? (
                                                <Form.Group>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={editingContent}
                                                        onChange={(e) => setEditingContent(e.target.value)}
                                                    />
                                                    <div className="d-flex mt-2 justify-content-between">
                                                        <Button variant="secondary" onClick={handleCancelEdit}>
                                                            Hủy
                                                        </Button>
                                                        <Button variant="success" onClick={handleSaveEdit}>
                                                            Lưu
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                            ) : (
                                                <p className="mb-0">{review.comment}</p>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-muted text-center">Chưa có bình luận nào được gửi.</div>
                    )}

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Xác nhận xóa</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Bạn có chắc chắn muốn xoá bình luận này?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Hủy
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Xóa
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}

            <div className="mt-4">
                <Paging
                    classActive={"bg-success text-white"}
                    data={pagingData}
                    onChange={handleChangePage}
                />
            </div>
        </Container>
    );
};

export default ReviewTab;