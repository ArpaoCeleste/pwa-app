import React, { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { TabContext } from "../AdminPage/contexts/TabProvider/TabContext.jsx";
import { UsersContext } from "../../contexts/UsersProvider/UsersContext.jsx";

import {
  Row,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Games from "./components/Games/index.jsx";
import Stadium from "./components/Stadium/index.jsx";
import Users from "./components/Users/index.jsx";
import Tickets from "./components/Tickets/index.jsx";

const AdminPage = () => {

  const [activePage, setActivePage] = useState("1");
  const { gamesCount } = useContext(TabContext);
  const { countUsers } = useContext(UsersContext);

  const navItems = [
  {
    id: "1",
    title: "Users",
    count: countUsers,
  },
  {
    id: "2",
    title: "Stadium",
  },
  {
    id: "3",
    title: "Games",
    count: gamesCount,
  },
  {
    id: "4",
    title: "Tickets",
  },
];

const items = [
  {
    id: "1",
    children: <Users />,
  },
  {
    id: "2",
    children: <Stadium/>,
  },
  {
    id: "3",
    children: <Games/>,
  },
  {
    id: "4",
    children: <Tickets/>,
  },
];


  return (
    <Container className={styles.container}>
      <h1>Admin</h1>
      <Row className={styles.row}>
        <Nav tabs>
            {navItems.map((item) => {
              return (
                <NavItem>
                  <NavLink
                    className={item.id === activePage}
                    onClick={() => setActivePage(item.id)}
                  >
                    {item.title} {item.count && (<span className={styles.count}>{item.count}</span>)}
                  </NavLink>
                </NavItem>
              );
            })}
        </Nav>
        <TabContent activeTab={activePage}>
          {items.map((item) => {
            return (
              <TabPane tabId={item.id}>
                { item.children }
              </TabPane>
            );
          })}
        </TabContent>
      </Row>
    </Container>
  );
};

export default AdminPage;
