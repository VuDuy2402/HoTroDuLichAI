import CardTag from "./component/CardTag/CardTag";
import mainimg from "../../assets/img/—Pngtree—big isolated cartoon character vector_7256413.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { systemAction } from "../../redux/slices/systemSlice";
import { FaSearch } from "react-icons/fa";
import LinkCustom from "../../common/components/LinkCustom/LinkCustom";
import { useNavigate } from "react-router-dom";
import bgMain from "@/assets/img/bgMain.jpg";
import bgKH from "@/assets/img/bgkh.webp";

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
    <>
      {/* <ChatComponent /> */}
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
      <div className="">
        <div className="my-5 text-center">
          <h1 className="text-primary">Top điểm đến nổi tiếng</h1>
          <div className="d-flex flex-row justify-content-center gap-3 px-3">
            <div className="">
              <div className="">
                <img src="/src/assets/img/cauvang.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Cầu Vàng Đà Nẵng</h3>
              </div>
              <button type="button" className="btn btn-primary">Xem chi tiết</button>
            </div>
            <div className="">
              <div className="">
                <img src="/src/assets/img/bgHoiAn.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Phố Cổ Hội An</h3>
              </div>
              <button type="button" className="btn btn-primary">Xem chi tiết</button>
            </div>
            < div className="">
              <div className="">
                <img src="/src/assets/img/bgHoiAn.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Cố đô Huế</h3>
              </div>
              <button type="button" className="btn btn-primary">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="my-3 text-center">
          <h1 className="text-primary">Tìm hiểu thêm về các tours du lịch</h1>
          <div className="d-flex flex-row justify-content-center gap-3 px-3">
            <div className="">
              <div className="">
                <img src="/src/assets/img/cauvang.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: 'right' }}>NEW - 19 Oct 2024</div>
                <h3 className="fs-5 text-left">Lan Ha Bay in Vietnam</h3>
              </div>
            </div>
            <div className="">
              <div className="">
                <img src="/src/assets/img/bgHoiAn.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: 'right' }}>NEW - 19 Oct 2024</div>
                <h3 className="fs-5 text-left">Best Time to Visit Phu Quoc Island in Vietnam</h3>
              </div>
            </div>
            < div className="">
              <div className="">
                <img src="/src/assets/img/bgHoiAn.jpg" alt="" className="w-100 h-100" />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: 'right' }}>NEW - 19 Oct 2024</div>
                <h3 className="fs-5 text-left">Ninh Binh – Halong Bay on Land</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="" style={{
        backgroundImage: `url(${bgKH})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
        <div className="my-3 text-center mb-10">
          <h1 className="text-primary">Khách hàng đánh giá</h1>
          <div className="fs-6">Mục tiêu hàng đầu của chúng tôi là sự hài lòng của khách hàng</div>
          <div>Faucibus tristique felis potenti ultrices ornare rhoncus semper hac facilisi Rutrum tellus lorem sem velit nisi non.</div>
          <div>Đặt chuyến tham quan ngay hôm nay và tận hưởng khoản tiết kiệm độc quyền cho bất kỳ chuyến đi nào bạn đặt trong tương lai! Không có giới hạn thời gian hoặc ngày hết hạn đối với những khoản tiết kiệm này</div>
        </div>
      </div>


    </>
  );
};
export default Home;
