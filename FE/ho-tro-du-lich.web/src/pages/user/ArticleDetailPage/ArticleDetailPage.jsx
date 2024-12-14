import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleService } from '../../../services/articleService';
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { ApprovalTypeDescriptions } from '../../../enum/approvalTypeEnum';
import { CArticleTypeDescriptions } from '../../../enum/articleTypeEnum';
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
        toast.error(`Failed to fetch article details: ${error}`);
      } finally {
        dispatch(systemAction.disableLoading());
      }
    };

    fetchArticleDetail();
  }, [articleId, dispatch]);

  useEffect(() => {
    if (article) {
      useDocumentTitle(article.title);
    }
  }, [article]);

  if (!article) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const processContentWithImages = (content) => {
    const imgRegex = /<img([^>]+)>/g;
    return content.replace(imgRegex, (match, p1) => {
      const src = p1.match(/src="([^"]+)"/);
      const alt = p1.match(/alt="([^"]+)"/);
      if (src) {
        return `<img src="${src[1]}" alt="${alt ? alt[1] : ''}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />`;
      }
      return match;
    });
  };

  const processedContent = processContentWithImages(article.content);

  return (
    <Container className="article-detail-page">
      {errors.length > 0 && <FormErrorAlert errors={errors} />}
      <Row className="article-header">
        <Col>
          <h1 className="article-title my-5 text-center">{article.title}</h1>
          <hr />
          <div className="article-meta d-flex justify-content-between">
            <div>
              <span className='me-1'>Trạng thái: </span>
                <Badge
                  className={
                    article.approvalType === 'approved' ? 'badge-success' :
                      article.approvalType === 'pending' ? 'badge-warning' :
                        article.approvalType === 'rejected' ? 'badge-danger' :
                          'badge-secondary'
                  }
                  style={{ fontWeight: 500, borderRadius: '12px', padding: '0.3em 0.6em', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.opacity = 0.8}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                >
                  {ApprovalTypeDescriptions[article.approvalType]}
                </Badge>
              <br />
              <span className='me-1'>Thể loại: </span>
                <Badge
                  className={
                    article.articleType === 'news' ? 'badge-info' :
                      article.articleType === 'tutorial' ? 'badge-primary' :
                        article.articleType === 'opinion' ? 'badge-light' :
                          'badge-secondary'
                  }
                  style={{ fontWeight: 500, borderRadius: '12px', padding: '0.3em 0.6em', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.opacity = 0.8}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                >
                  {CArticleTypeDescriptions[article.articleType]}
                </Badge>
            </div>

            <div>
              <span className="article-author">Tác giả: {article.author}</span><br />
              <span className="article-date">
                Ngày viết: {new Date(article.createdDate).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span><br />
              <span>Số lượt xem : {article.viewCount}</span>
            </div>
          </div>
        </Col>
      </Row>
      <hr />
      <Row className="article-content my-3">
        <Col>
          <div dangerouslySetInnerHTML={{ __html: processedContent }}></div>
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
