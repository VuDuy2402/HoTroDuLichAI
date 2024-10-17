import CardTag from "./component/CardTag/CardTag";
import mainimg from "../../assets/img/—Pngtree—big isolated cartoon character vector_7256413.png";
import Card from "../../common/components/Card/Card";
import { useEffect, useState } from "react";
import { courseIntakeService } from "../../services/courseIntakeService";
import { CourseIntakePagingDto } from "../../common/dtos/CourseIntakePagingDto";
import { useDispatch } from "react-redux";
import { systemAction } from "../../redux/slices/systemSlice";
import { FaSearch } from "react-icons/fa";
import LinkCustom from "../../common/components/LinkCustom/LinkCustom";
import { useNavigate } from "react-router-dom";
import bgMain from "@/assets/img/bgMain.jpg";

const Home = () => {
  const navigate = useNavigate();
  // const [listCourseIntake, setListCourseIntake] = useState([]);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const fetchApi = async () => {
  //     dispatch(systemAction.enableLoading());
  //     const data = CourseIntakePagingDto;
  //     const result = await courseIntakeService.paging(data);
  //     if (result.success) {
  //       setListCourseIntake(result.data.items);
  //     }
  //     dispatch(systemAction.disableLoading());
  //   };
  //   fetchApi();
  // }, []);
  return (
    <div
      className="container-fluid p-5"
      style={{
        backgroundImage: `url(${bgMain})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="main-content mx-auto">
        <div className="row justify-content-center">
          <div className="col-5 d-flex flex-column justify-content-center">
            <h2>
              Du Lịch Cùng Với{" "}
              <span className="text-success">Ước Mơ Của Bạn</span>
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              commodi fuga, similique animi blanditiis odit quisquam aliquam
              perferendis architecto doloribus!
            </p>
            <div className="d-flex gap-2">
              <input
                className="form-control rounded-pill"
                placeholder="Tìm kiếm địa điểm . . ."
              />
              <button className="btn btn-success">
                <FaSearch color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------- */}
    </div>
  );
};
export default Home;
