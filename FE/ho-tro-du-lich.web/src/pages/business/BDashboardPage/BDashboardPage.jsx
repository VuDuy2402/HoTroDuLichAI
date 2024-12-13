import { useEffect, useState } from "react";
import { Row, Col, Form, Card, Button, Container } from "react-bootstrap";
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Select from "react-select";
import {
  IoPersonCircle,
  IoBarChartOutline,
  IoStatsChartOutline,
  IoPieChartSharp,
  IoAtCircleSharp,
  IoCompassOutline,
  IoBulbOutline,
  IoEllipseOutline,
  IoGridOutline,
  IoWalletOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { businessService } from "../../../services/businessService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { systemAction } from "../../../redux/slices/systemSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import UserInfo from "../../../common/components/UserTag/UserInfo";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const BDashboardPage = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cards, setCards] = useState([]);
  const [errors, setErrors] = useState([]);

  const [userInfo, setUserInfo] = useState(null);
  // #region : chart
  const [totalRevenueChart, setTotalRevenueChart] = useState("line");
  const [totalUseChart, setTotalUseChart] = useState("line");
  const [dataTotalRevenueChart, setDataTotalRevenueChart] = useState({});
  const [dataTotalUseChart, setDataTotalUseChart] = useState({});
  // #endregion : chart
  const dispatch = useDispatch();
  useDocumentTitle('Thống kê');
  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartOptions = [
    { value: "bar", label: "Bar Chart", icon: <IoBarChartOutline /> },
    { value: "line", label: "Line Chart", icon: <IoStatsChartOutline /> },
    { value: "pie", label: "Pie Chart", icon: <IoPieChartSharp /> },
    { value: "doughnut", label: "Doughnut Chart", icon: <IoAtCircleSharp /> },
    { value: "radar", label: "Radar Chart", icon: <IoCompassOutline /> },
    { value: "polarArea", label: "Polar Area Chart", icon: <IoBulbOutline /> },
    { value: "bubble", label: "Bubble Chart", icon: <IoEllipseOutline /> },
    { value: "scatter", label: "Scatter Chart", icon: <IoGridOutline /> },
  ];

  const handleChartChange = (selectedOption, chartIndex) => {
    if (chartIndex === 1) {
      setTotalRevenueChart(selectedOption.value);
    } else if (chartIndex === 2) {
      setTotalUseChart(selectedOption.value);
    }
  };

  const renderChart = (selectedChart, chartData) => {
    const chartHeight = 250;
    const chartStyle = {
      height: `${chartHeight}px`,
      overflow: "hidden",
    };

    if (!chartData.datasets || chartData.datasets.length === 0) {
      return <div>Loading chart data...</div>;
    }

    switch (selectedChart) {
      case "bar":
        return (
          <Bar
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "pie":
        return (
          <Pie
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "doughnut":
        return (
          <Doughnut
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "radar":
        return (
          <Radar
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "polarArea":
        return (
          <PolarArea
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "bubble":
        return (
          <Bubble
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      case "scatter":
        return (
          <Scatter
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
      default:
        return (
          <Line
            data={chartData}
            height={chartHeight}
            options={{ responsive: true }}
            style={chartStyle}
          />
        );
    }
  };

  const fetchUserInfo = async () => {
    try {
      const businessContactInfo =
        await businessService.businessGetContactInfo();
      if (businessContactInfo && businessContactInfo.success) {
        setUserInfo(businessContactInfo.data);
      } else if (businessContactInfo && businessContactInfo.errors) {
        setErrors(businessContactInfo.errors);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải thông tin người dùng: " + error);
    }
  };

  const fetchDataForChart = async () => {
    const requestData = {
      FromDate: new Date(fromDate).toISOString(),
      ToDate: new Date(toDate).toISOString(),
    };
    dispatch(systemAction.enableLoading());
    try {
      const businessViewContactReport =
        await businessService.businessReportViewContact(requestData);
      if (businessViewContactReport && businessViewContactReport.success) {
        const { data } = businessViewContactReport;

        setCards([
          {
            name: `Tổng doanh thu từ ngày ${fromDate} đến ${toDate}`,
            icon: <IoWalletOutline />,
            quantity: data.totalAmount,
          },
          {
            name: `Tổng số lượt liên hệ từ ngày ${fromDate} đến ${toDate}`,
            icon: <IoPersonCircle />,
            quantity: data.totalContact,
          },
          {
            name: `Tổng số lượt xem từ ngày ${fromDate} đến ${toDate}`,
            icon: <IoEyeOutline />,
            quantity: data.totalView,
          },
        ]);
      } else if (
        businessViewContactReport &&
        businessViewContactReport.errors
      ) {
        setErrors(businessViewContactReport.errors);
      }

      const businessServiceUsedReport =
        await businessService.businessReportServiceUsed(requestData);
      if (businessServiceUsedReport && businessServiceUsedReport.success) {
        const { data } = businessServiceUsedReport;

        const serviceLabels = data.map((item) => item.serviceName);
        const totalAmountData = data.map((item) => item.totalAmount);
        const totalUseData = data.map((item) => item.totalUse);

        setDataTotalRevenueChart({
          labels: serviceLabels,
          datasets: [
            {
              label: "Total Amount",
              data: totalAmountData,
              backgroundColor: totalAmountData.map(() => randomColor()),
              borderColor: totalAmountData.map(() => randomColor()),
              borderWidth: 1,
            },
          ],
        });

        setDataTotalUseChart({
          labels: serviceLabels,
          datasets: [
            {
              label: "Total Use",
              data: totalUseData,
              backgroundColor: totalUseData.map(() => randomColor()),
              borderColor: totalUseData.map(() => randomColor()),
              borderWidth: 1,
            },
          ],
        });
      } else if (
        businessViewContactReport &&
        businessViewContactReport.errors
      ) {
        setErrors(businessViewContactReport.errors);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi:" + error);
    } finally {
      dispatch(systemAction.disableLoading());
    }
  };

  const handleSubmit = () => {
    if (fromDate && toDate) {
      fetchDataForChart();
    }
  };

  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const fromDateString = oneMonthAgo.toISOString().split("T")[0];
    const toDateString = today.toISOString().split("T")[0];

    setFromDate(fromDateString);
    setToDate(toDateString);
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchDataForChart();
    }
  }, [fromDate, toDate]);

  return (
    <Container>
      <Row className="my-4 border-1 border-bottom py-3">
        <Col md={6}>
          <Form>
            <FormErrorAlert errors={errors} />
            <Row>
              <Col>
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <ErrorField errorList={errors} field={"FromDate_Error"} />
              </Col>
              <Col>
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <ErrorField errorList={errors} field={"ToDate_Error"} />
              </Col>
            </Row>
            <Button
              variant="outline-secondary"
              className="mt-3"
              onClick={handleSubmit}
            >
              Xác nhận
            </Button>
          </Form>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          {userInfo && <UserInfo userInfo={userInfo} />}
        </Col>
      </Row>

      <Row className="mb-4">
        {cards.map((card, idx) => (
          <Col key={idx} md={4}>
            <Card className="text-center">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="icon-wrapper"
                    style={{
                      fontSize: "30px",
                      color: "#007bff",
                      marginRight: "10px",
                    }}
                  >
                    {card.icon}
                  </div>
                  <Card.Title
                    className="text-end"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {card.name}
                  </Card.Title>
                </div>
                <Card.Text
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  {card.quantity.toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>
                Doanh thu theo loại dịch vụ từ ngày {fromDate} đến {toDate}
              </Card.Title>
              <Select
                options={chartOptions}
                value={chartOptions.find(
                  (option) => option.value === totalRevenueChart
                )}
                onChange={(selectedOption) =>
                  handleChartChange(selectedOption, 1)
                }
                getOptionLabel={(e) => (
                  <div className="d-flex align-items-center">
                    <span className="me-2">{e.icon}</span>
                    <span className="ms-1">{e.label}</span>
                  </div>
                )}
              />
              {renderChart(totalRevenueChart, dataTotalRevenueChart)}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>
                Loại dịch vụ được sử dụng trong các chuyến hành trình từ ngày{" "}
                {fromDate} đến {toDate}
              </Card.Title>
              <Select
                options={chartOptions}
                value={chartOptions.find(
                  (option) => option.value === totalUseChart
                )}
                onChange={(selectedOption) =>
                  handleChartChange(selectedOption, 2)
                }
                getOptionLabel={(e) => (
                  <div className="d-flex align-items-center">
                    <span className="mr-2">{e.icon}</span>
                    <span>{e.label}</span>
                  </div>
                )}
              />
              {renderChart(totalUseChart, dataTotalUseChart)}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BDashboardPage;
