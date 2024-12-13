import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleService } from '../../../services/articleService';
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import { Container, Row, Col, Image, Alert, Spinner } from 'react-bootstrap';

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const [errors, setErrors] = useState([]);
  const [article, setArticle] = useState(null);
  const dispatch = useDispatch();
  useDocumentTitle('Chi tiết bài viết');

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

    fetchArticleDetail();
  }, [articleId]);

  if (!article) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="article-detail-page">
      {errors.length > 0 && <FormErrorAlert errors={errors} />}
      <Row className="article-header">
        <Col>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-author">{article.author}</span>
            <span className="article-date">
              {new Date(article.createdDate).toLocaleDateString()}
            </span>
          </div>
        </Col>
      </Row>

      <Row className="article-thumbnail">
        <Col>
          {article.thumbnail && <Image src={article.thumbnail} alt={article.title} fluid />}
        </Col>
      </Row>

      <Row className="article-content">
        <Col>
          <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </Col>
      </Row>

      <Row className="approval-status">
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
          <span className="article-owner">{article.ownerProperty.name}</span>
        </Col>
      </Row>
    </Container>
  );
};

ArticleDetailPage.propTypes = {
  articleId: PropTypes.string.isRequired,
};

export default ArticleDetailPage;
