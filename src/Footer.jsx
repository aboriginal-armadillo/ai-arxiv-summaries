import React from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row className="justify-content-center">
                    <Col md="6" className="text-center">
                        <p>&copy; {new Date().getFullYear()} Aboriginal Armadillo LLC. All rights reserved.</p>
                        <Nav className="justify-content-center">
                            <NavItem>
                                <NavLink href="/faq">FAQ</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="mailto:trevor@aboriginal-armadillo.com">Contact</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/terms-of-service">Terms of Service</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/privacy-policy">Privacy Policy</NavLink>
                            </NavItem>
                            {/* Add any other links you think would be appropriate here */}
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
