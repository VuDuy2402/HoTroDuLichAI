import { useParams } from "react-router-dom";
import { itineraryService } from "../../../services/itineraryService";
import { useEffect } from "react";

const ItineraryDetailPage = () => {
  const { itineraryId } = useParams();
  const getInitData = async () => {
    const result = await itineraryService.getDetail(itineraryId);
    if (result) {
      if (result.success) {
        console.log(result);
      }
    }
  };
  useEffect(() => {
    getInitData();
  }, []);
  return (
    <div className="container p-2">
      <h4>Chi tiết hành trình</h4>
    </div>
  );
};

export default ItineraryDetailPage;
