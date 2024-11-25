import { useState } from 'react';
import { Row, Col, Form, Card, Button, Container } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
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
    Legend
} from 'chart.js';
import Select from 'react-select';
import { IoPersonCircle, IoBarChartOutline, IoStatsChartOutline, IoPieChartSharp, IoAtCircleSharp, IoCompassOutline, IoBulbOutline, IoEllipseOutline, IoGridOutline } from 'react-icons/io5';

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
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const randomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Dữ liệu ví dụ cho biểu đồ với màu ngẫu nhiên cho từng phần
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sample Data',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor()
                ], // Mỗi phần của Pie/Bar có màu riêng
                borderColor: [
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor(),
                    randomColor()
                ], // Màu viền cho Pie/Bar
                borderWidth: 1,
                fill: false,
                tension: 0.1,
            },
        ],
    };

    const cards = [
        { name: 'Total Sales', icon: <IoBarChartOutline />, quantity: 1200 },
        { name: 'Customers', icon: <IoPersonCircle />, quantity: 350 },
        { name: 'New Orders', icon: <IoStatsChartOutline />, quantity: 78 },
    ];


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


    const [selectedChart1, setSelectedChart1] = useState("line");
    const [selectedChart2, setSelectedChart2] = useState("line");

    const handleChartChange = (selectedOption, chartIndex) => {
        if (chartIndex === 1) {
            setSelectedChart1(selectedOption.value);
        } else if (chartIndex === 2) {
            setSelectedChart2(selectedOption.value);
        }
    };

    const renderChart = (selectedChart) => {
        const chartHeight = 250;
        const chartStyle = {
            height: `${chartHeight}px`,
            overflow: 'hidden',
        };

        switch (selectedChart) {
            case 'bar':
                return <Bar data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'pie':
                return <Pie data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'doughnut':
                return <Doughnut data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'radar':
                return <Radar data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'polarArea':
                return <PolarArea data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'bubble':
                return <Bubble data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            case 'scatter':
                return <Scatter data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
            default:
                return <Line data={chartData} height={chartHeight} options={{ responsive: true }} style={chartStyle} />;
        }
    };

    return (
        <Container>
            <Row className="my-4">
                <Col md={6}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Label>Từ ngày</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Đến ngày</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Button variant="outline-secondary" className="mt-3">
                            Xác nhận
                        </Button>
                    </Form>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center">
                    <div className="text-center d-flex">
                        <div>Hi, UserName</div>
                        <img
                            src="https://via.placeholder.com/100"
                            alt="User"
                            className="rounded-circle mb-2"
                            style={{ width: '80px', height: '80px' }}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="mb-4">
                {cards.map((card, idx) => (
                    <Col key={idx} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{card.name}</Card.Title>
                                <Card.Text>{card.icon} {card.quantity}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Chart 1</Card.Title>
                            <Select
                                options={chartOptions}
                                value={chartOptions.find(option => option.value === selectedChart1)}
                                onChange={(selectedOption) => handleChartChange(selectedOption, 1)}
                                getOptionLabel={(e) => (
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">{e.icon}</span>
                                        <span className='ms-1'>{e.label}</span>
                                    </div>
                                )}
                            />
                            {renderChart(selectedChart1)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Chart 2</Card.Title>
                            <Select
                                options={chartOptions}
                                value={chartOptions.find(option => option.value === selectedChart2)}
                                onChange={(selectedOption) => handleChartChange(selectedOption, 2)}
                                getOptionLabel={(e) => (
                                    <div className="d-flex align-items-center">
                                        <span className="mr-2">{e.icon}</span>
                                        <span>{e.label}</span>
                                    </div>
                                )}
                            />
                            {renderChart(selectedChart2)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BDashboardPage;