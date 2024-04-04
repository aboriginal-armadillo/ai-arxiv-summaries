import { Button,
    Collapse,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Modal,
    ModalBody,
    ModalHeader } from "reactstrap";
import React, { useState } from "react";
const PointModal = ({ isModalOpen, toggleModal, selectedPoint }) => {
    // State to manage the collapse
    const [isOpen, setIsOpen] = useState(false);

    // Toggle function for the collapse
    const toggleCollapse = () => setIsOpen(!isOpen);

    return (
        <Modal isOpen={isModalOpen}
               toggle={toggleModal}
               style={{ maxWidth: '75%', width: '75%' }}>
            <ModalHeader toggle={toggleModal}>{selectedPoint ? selectedPoint.title : 'No Title'}</ModalHeader>
            <ModalBody>
                {selectedPoint && (
                    <Card>
                        <Button color="primary"
                                onClick={() => window.open('https://arxiv.org/abs/' + selectedPoint.id, '_blank')}
                                style={{ marginBottom: '1rem'}}>
                            View on ArXiv
                        </Button>
                        <CardHeader>
                            {selectedPoint.id}
                            {/* Button to toggle the collapse */}
                            <Button color="primary" onClick={toggleCollapse}
                                    style={{ marginBottom: '1rem', float: 'right' }}>
                                View Abstract
                            </Button>


                        </CardHeader>
                        <Collapse isOpen={isOpen}>
                            <CardBody>
                                {/* Now the summary is inside a collapsible body */}
                                <CardText>{selectedPoint.summary}</CardText>
                            </CardBody>
                        </Collapse>
                    </Card>
                )}
            </ModalBody>
        </Modal>
    );
};

export { PointModal };
