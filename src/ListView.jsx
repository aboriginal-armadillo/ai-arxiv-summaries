import React, {useState} from 'react';
import {PointModal} from './PointModal'; // Ensure this import is correct based on your project structure
import { Container, Card, CardBody, Row, Col } from 'reactstrap';

const ListView = ({ points }) => {

    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleTitleClick = (point) => {
        setSelectedPoint(point);
        toggleModal();
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const formatDate = (timestamp) => {
        if (!timestamp) return "No date provided";
        return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US");
    };

    return (
        <>
            <Container fluid style={{ padding: '20px' }}>
                <h2>Arxiv Articles</h2>
                {points.map(point => (
                    <Card key={point.id} style={{ margin: '10px 0' }}>
                        <CardBody onClick={() => handleTitleClick(point)} style={{ cursor: 'pointer' }}>
                            <Row>
                                <Col md="8" sm="12">
                                    <div>
                                        <strong style={{ fontSize: '1.25em' }}>
                                            {point.ai_summary && '🤗 '}
                                            {point.title}
                                        </strong>
                                    </div>
                                    <div style={{ fontSize: '0.85em', color: 'gray' }}>
                                        {point.author}
                                    </div>
                                </Col>
                                <Col md="4" sm="12" style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85em', color: 'gray' }}>
                                        {formatDate(point.created)}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                ))}
            </Container>
            <PointModal isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                        selectedPoint={selectedPoint} />
        </>
    );
};

export default ListView;
