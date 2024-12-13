import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { articleService } from '../../../services/articleService';
import { systemAction } from "@/redux/slices/systemSlice";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import FormErrorAlert from "../../../common/components/FormErrorAlert/FormErrorAlert";
import { Modal, Button, Row, Col, Image, Alert, Spinner } from 'react-bootstrap';

const AArticleDetailPage = ({ show, onClose, articleId }) => {
  const [errors, setErrors] = useState([]);
  const [article, setArticle] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        dispatch(systemAction.enableLoading());
        const response = await articleService.getArticleDetailById(articleId);
        if (response) {
          if (response.success) {
            setArticle(response.data);
          } else if (response.errors) {
            setErrors(response.errors);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch article details:', error);
      } finally {
        dispatch(systemAction.disableLoading());
      }
    };

    if (show && articleId) {
      fetchArticleDetail();
    }
  }, [articleId, dispatch, show]);

  if (!article && show) {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Loading Article...</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      {errors.length > 0 && <FormErrorAlert errors={errors} />}
      {article && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{article.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="article-header mb-3">
              <Col>
                <div className="article-meta">
                  <span className="article-author">{article.author}</span>
                  <span className="article-date">
                    {new Date(article.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </Col>
            </Row>

            <Row className="article-thumbnail mb-3">
              <Col>
                {article.thumbnail && <Image src={article.thumbnail} alt={article.title} fluid />}
              </Col>
            </Row>

            <Row className="article-content mb-3">
              <Col>
                <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
              </Col>
            </Row>

            <Row className="approval-status mb-3">
              <Col>
                {article.approvalType === 'Approved' ? (
                  <Alert variant="success">Được phê duyệt</Alert>
                ) : (
                  <Alert variant="warning">Chờ phê duyệt</Alert>
                )}
              </Col>
            </Row>

            <Row className="article-footer">
              <Col>
                <span className="article-owner">{article.ownerProperty?.name}</span>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

AArticleDetailPage.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  articleId: PropTypes.string.isRequired,
};

export default AArticleDetailPage;