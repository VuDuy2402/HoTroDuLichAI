import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleService } from '../../../services/articleService';
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const [errors, setErrors] = useState([]);
  const [article, setArticle] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        dispatch(systemAction.enableLoading());
        const response = await articleService.getArticleDetailById(articleId);
        if (response)
        {
            if (response.success)
            {
                setArticle(response.data);
            }
        }
        else if (response.errors)
        {
            setErrors(response.errors);
        }
      } catch (error) {
        toast.error('Failed to fetch article details:', error);
      }
      finally
      {
        dispatch(systemAction.disableLoading());
      }
    };

    fetchArticleDetail();
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-detail-page">
      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-author">{article.author}</span>
          <span className="article-date">
            {new Date(article.createdDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="article-thumbnail">
        {article.thumbnail && <img src={article.thumbnail} alt={article.title} />}
      </div>

      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>

      {/* Phần kiểm tra trạng thái phê duyệt */}
      {article.approvalType === 'Approved' ? (
        <div className="approval-status approved">Được phê duyệt</div>
      ) : (
        <div className="approval-status pending">Chờ phê duyệt</div>
      )}

      <div className="article-footer">
        <span className="article-owner">{article.ownerProperty.name}</span>
        {/* Có thể thêm các hành động như chia sẻ, bình luận, v.v. */}
      </div>
    </div>
  );
};

ArticleDetailPage.propTypes = {
  articleId: PropTypes.string.isRequired,
};

export default ArticleDetailPage;
