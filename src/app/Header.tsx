import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class Header extends React.Component<any, any> {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Graphical memories</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Motivation</NavItem>
            <NavItem eventKey={2} href="#">Author</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Import</NavItem>
            <NavItem eventKey={2} href="#">Login</NavItem>
            <NavItem eventKey={3} href="#">Create Account</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
};
