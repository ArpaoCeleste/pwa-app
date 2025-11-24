import { useForm } from "react-hook-form";
import { Row } from "reactstrap";
import styles from "./styles.module.scss";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import _ from "lodash";

const LoginForm = ({ title, role, data }) => {
  const { register, handleSubmit } = useForm();
  const [isLogged, setLogged] = useState(false);
  const onSubmit = (data) => login(data);

  const login = (data) => {
    fetch("/api/auth/login", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((response) => {

        if (response.auth) {
          setLogged(response.auth);
        } else {
          alert("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if(!_.isEmpty(data)) {
      login(data);
    }
  },[data])
  
  if (isLogged) {
    return role === "admin" ? (
      <Navigate to="/admin" replace={true} />
    ) : (
      <Navigate to="/user" replace={true} />
    );
  }

  return (
    <div>
      <Row align="middle" justify="center">
        <div className={styles.loginForm}>
          <h2>{title}</h2>
          <form className={styles.formLogin} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Name:
              </label>
              <input
                id="name"
                name="name"
                required
                {...register("name")}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                {...register("password")}
              />
            </div>

            <input className="submit" type="submit" />
          </form>
        </div>
      </Row>
    </div>
  );
};

export default LoginForm;
