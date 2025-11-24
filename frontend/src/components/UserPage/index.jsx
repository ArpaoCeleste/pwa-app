import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Tickets } from "./components/Tickets";
import { Perfil } from "./components/Perfil";
import styles from "./styles.module.scss";
import { useGetPerfil } from "../../hooks/useGetPerfil";
import {
  socketAddListener,
  socketRemoveListener,
  initSocket,
} from "../../socket/socket";
import { toast } from "react-toastify";

const UserPage = () => {
  const [activePage, setActivePage] = useState("1");
  const { isError, isLoading, user } = useGetPerfil("users");

  const listenerConfigureRef = useRef(false);
  
  const newNotification = (data) => {
    if(data.key === "Game"){
      toast.warn(data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } else {
      toast.info(data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  useEffect(() => {
    initSocket();
    if(!listenerConfigureRef.current){
      console.log("Configurando ouvinte pela primeira vez");

      const handleNotification = (data) => {
        newNotification(data);
      };

      socketAddListener("admin_notifications", handleNotification);

      listenerConfigureRef.current = true;
    } else {
      console.log("ouvinte ja configurado. ignorando....");
    }
    return (handleNotification) => {
      socketRemoveListener("admin_notifications", handleNotification);
    };
  }, []);

  const navItems = [
    {
      id: "1",
      title: "Perfil",
    },
    {
      id: "2",
      title: "Tickets",
    }
  ];
  const items = [
    {
      id: "1",
      children: <Perfil user={user.data} />,
    },
    {
      id: "2",
      children: <Tickets />,
    },
  ];
  return (
    <Container className={styles.container}>
      <h1>User {user.data.name}</h1>
      <Row className={styles.row}>
        <Nav tabs>
          {navItems.map((item) => {
            return (
              <NavItem>
                <NavLink
                  className={item.id === activePage}
                  onClick={() => setActivePage(item.id)}
                >
                  {item.title}{" "}
                  {item.count && (<span
                    className={styles.count}>{item.count}</span>)}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
        <TabContent activeTab={activePage}>
          {items.map((item) => {
            return (
              <TabPane tabId={item.id}>
                {item.children}
              </TabPane>
            );
          })}
        </TabContent>
      </Row>
    </Container>
  );
};
export default UserPage;