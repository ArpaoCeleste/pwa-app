import React, { useContext } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import styles from "./styles.module.scss";
import { UsersContext } from "../../contexts/UsersProvider";
import logo from "/logo192.png";

const Header = () => {

  return (
    <div className={styles.navBar}>
      <div className={styles.logo}>
        <img className={styles.img} src={logo} alt="Logo" width={40} height={40}/>
        <h1>PWA</h1>
      </div>
      <Navbar pills={true} container={false} className={styles.navBar}>
        <NavbarBrand className={styles.link} href="/">
          Login
        </NavbarBrand>
        <NavbarBrand href="/">Register</NavbarBrand>
      </Navbar>
    </div>
  );
};

export default Header;