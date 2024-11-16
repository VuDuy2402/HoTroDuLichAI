import { useCallback, useEffect, useState } from "react";

const pageDisplay = 5;
const Paging = ({ data, onChange, classActive, classDeactive }) => {
  const [listPaging, setListPaging] = useState([]);

  useEffect(() => {
    const generatePage = () => {
      if (data.total < data.currentPage) {
        return;
      }
      let numberLeft = Math.floor((pageDisplay - 1) / 2);
      let numberRight = Math.floor((pageDisplay - 1) / 2);

      while (data.currentPage - numberLeft < 1) {
        numberLeft--;
        numberRight++;
      }

      while (Number(data.currentPage) + Number(numberRight) > data.total) {
        numberRight--;
        if (data.currentPage - (Number(numberLeft) + 1) >= 1) {
          numberLeft++;
        }
      }
      let result = [];
      for (
        let i = data.currentPage - numberLeft;
        i <= Number(data.currentPage) + numberRight;
        i++
      ) {
        result.push(i);
      }
      setListPaging(result);
    };
    generatePage();
  }, [data]);

  const handleChangePage = useCallback(
    (pageParam) => {
      if (pageParam !== data.currentPage) {
        onChange(pageParam);
      }
    },
    [data]
  );

  return (
    <div className="paging d-flex align-items-center justify-content-between">
      <p className="m-0">
        Page {data.currentPage} of {data.total}
      </p>
      <div className="frame-paging d-flex gap-1">
        <button
          className="btn btn-outline-secondary"
          disabled={data.currentPage === 1}
          onClick={() => handleChangePage(1)}
        >
          First
        </button>
        {listPaging.map((page) => (
          <button
            onClick={() => handleChangePage(page)}
            key={page}
            className={`btn border ${
              page === data.currentPage
                ? classActive
                  ? classActive
                  : "btn-warning"
                : classDeactive
                ? classDeactive
                : "btn-outline-secondary"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-outline-secondary"
          onClick={() => handleChangePage(data.total)}
          disabled={data.currentPage === data.total}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Paging;
