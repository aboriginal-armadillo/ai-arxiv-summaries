import React, {useState} from "react";
import {
    Button,
    Collapse,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

const PointModal = ({ isModalOpen, toggleModal, selectedPoint }) => {
    // Existing state for the summary collapse
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    // Additional state for the AI summary collapse
    const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);

    // Toggle function for the existing summary collapse
    const toggleSummaryCollapse = () => setIsSummaryOpen(!isSummaryOpen);
    // Toggle function for the new AI summary collapse
    const toggleAISummaryCollapse = () => setIsAISummaryOpen(!isAISummaryOpen);

    return (
        <Modal isOpen={isModalOpen} toggle={toggleModal} style={{ maxWidth: "75%", width: "75%" }}>
            <ModalHeader toggle={toggleModal}>{selectedPoint ? selectedPoint.title : "No Title"}</ModalHeader>
            <ModalBody>
                {selectedPoint && (
                    <Card>
                        <Button
                            color="primary"
                            onClick={() => window.open("https://arxiv.org/abs/" + selectedPoint.id, "_blank")}
                            style={{ marginBottom: "1rem" }}
                        >
                            View on {selectedPoint.id} on ArXiv
                        </Button>
                        {/* Existing summary accordion */}
                        <CardHeader>
                            Abstract
                            {/* Button to toggle the existing summary collapse */}
                            <Button color="primary" onClick={toggleSummaryCollapse} style={{ marginBottom: "1rem", float: "right" }}>
                                View
                            </Button>
                        </CardHeader>
                        <Collapse isOpen={isSummaryOpen}>
                            <CardBody>
                                <CardText>{selectedPoint.summary}</CardText>
                            </CardBody>
                        </Collapse>
                        {/* Additional AI summary accordion, displayed only if ai_summary exists */}
                        {selectedPoint.ai_summary && (
                            <>
                                <CardHeader>
                                    AI Summary
                                    {/* Button to toggle the new AI summary collapse */}
                                    <Button color="primary" onClick={toggleAISummaryCollapse} style={{ marginBottom: "1rem", float: "right" }}>
                                        View
                                    </Button>
                                </CardHeader>
                                <Collapse isOpen={isAISummaryOpen}>
                                    <CardBody>
                                        <CardText>{selectedPoint.ai_summary}</CardText>
                                    </CardBody>
                                </Collapse>
                            </>
                        )}
                    </Card>
                )}
            </ModalBody>
        </Modal>
    );
};

export { PointModal };
