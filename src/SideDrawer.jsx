import React, { useState } from 'react';
import { ButtonGroup, ToggleButton, Offcanvas, Form } from 'react-bootstrap';

function SideDrawer({ show, handleClose, handleModeChange, handleHFOnlyChange }) {
    const modes = [
        { name: '3D', value: '3d' },
        { name: '2D', value: '2d' },
    ];

    const [activeMode, setActiveMode] = useState('3d');
    const [HFOnly, setHFOnly] = useState(false);

    const handleChangeMode = (newValue) => {
        setActiveMode(newValue);
        handleModeChange(newValue);
    };

    const handleToggleHFOnly = (e) => {
        const newHFOnlyValue = e.target.checked;
        setHFOnly(newHFOnlyValue);
        handleHFOnlyChange(newHFOnlyValue);
    };

    return (
        <Offcanvas show={show}
                   onHide={handleClose}
                   placement="start"
                   style={{ backgroundColor: 'darkgrey' }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Options</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form.Label>Viewer Mode&nbsp;</Form.Label>
                <ButtonGroup className="mb-3">
                    {modes.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant="outline-primary"
                            name="radio"
                            value={radio.value}
                            checked={activeMode === radio.value}
                            onChange={(e) => handleChangeMode(e.currentTarget.value)}
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                {/* Toggle switch for HFOnly */}
                <Form.Check
                    type="switch"
                    id="hf-only-switch"
                    label="Huggingface Papers Only"
                    checked={HFOnly}
                    onChange={handleToggleHFOnly}
                />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default SideDrawer;
