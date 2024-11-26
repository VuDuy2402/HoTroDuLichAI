import { useEffect, useState } from "react";
import { articleService } from "../../../services/articleService";
import Table from "../../../common/components/Table/Table";

const AArticlePage = () => {
  const [dataArticle, setDataArticle] = useState([]);
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const [dataSend, setDataSend] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchQuery: "",
  });
  const handleGetDataArticle = async () => {
    const result = await articleService.paging(dataSend);
    if (result) {
      if (result.success) {
        console.log(result.data);

        setDataArticle(result.data.items);
        setPagingData({
          currentPage: result.data.currentPage,
          total: result.data.totalPages,
          pageSize: result.data.pageSize,
        });
      }
    }
  };
  useEffect(() => {
    handleGetDataArticle();
  }, [dataSend]);
  return (
    <div className="container">
      {/* <Table
        
    /> */}
    </div>
  );
};

export default AArticlePage;
