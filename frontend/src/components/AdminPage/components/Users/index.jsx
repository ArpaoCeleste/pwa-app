import { Container, Row, Col } from "reactstrap";
import Table from "../../../Table";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { useContext, useEffect } from "react";
import { UsersContext } from "../../../../contexts/UsersProvider";

const Users = () => {
  const { register, handleSubmit } = useForm();
  const { isError, isLoading, data, load } = useGetData("users/all-users", 0, 0);
  const { isLoading: isLoadingPost, postData } = usePostData("users/create-user");
  const { setUsers } = useContext(UsersContext);
  
  useEffect(() => {
    setUsers(data.users);
  },[data, setUsers])

  if (isLoading){
    return <div>Is Loading</div>
  } 
  if (isError){
    return <div>UPPSSSS</div>
  } 

  return (
    <Container>
      <Row>
        <Col className={styles.column}>
          <h3>Create User</h3>
          {
            isLoadingPost ? <div>Is Loading...</div>: 
          (
            <div className={styles.container}>
              <form
                className={styles.form}
                onSubmit={handleSubmit(async (formData) => {
                  const userPayload = {
                    ...formData,
                    role: { name: "NonMember", scope: ["notMember"] },
                  };

                  await postData(userPayload);
                  load(); 
                })}
              >
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">
                    Name:
                  </label>
                  <input id="name" type="text" required {...register("name")} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    {...register("password")}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    {...register("email")}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="age">
                    Age:
                  </label>
                  <input id="age" type="number" {...register("age")} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="address">
                    Address:
                  </label>
                  <input id="address" required {...register("address")} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="country">
                    Country:
                  </label>
                  <input id="country" required {...register("country")} />
                </div>

                <Row>
                  <input className="submit" type="submit" value="Add User" />
                </Row>
              </form>
            </div>
          )}
        </Col>

        <Col>
          <Table
            columns={["name", "email", "address", "country"]}
            rows={data.users}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Users;
