import { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import Qrcode from "../../../QrcodeCreate";
export const Perfil = ({ user = { name: "" } }) => {
    const { register, handleSubmit, reset } = useForm();
    useEffect(() => {
        // reset form with user data
        reset(user);
    }, [user]);
    return (
        <Container>
            <Row>
                <Col className={styles.column}>
                    <h3>Perfil</h3>
                    <div className={styles.container}>
                        <form
                            className={styles.form}
                            onSubmit={handleSubmit((data) => {
                                console.log(data);
                            })}
                        >
                            <div className={styles.field}>
                                <label className={styles.label} for="name">
                                    Name:
                                </label>
                                <input
                                    id="name"
                                    type="name"
                                    name="name"
                                    required="required"
                                    {...register("name")}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} for="password">
                                    Password:
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required="required"
                                    {...register("password")}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} for="email">
                                    Email:
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required="required"
                                    {...register("email")}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} for="age">
                                    Age :</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    {...register("age")}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} for="address">
                                    Address :
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    required="required"
                                    {...register("address")}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} for="country">
                                    Country :
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    required="required"
                                    {...register("country")}
                                />
                            </div>
                            <Row>
                                <input className="submit" type="submit" />
                            </Row>
                        </form>
                    </div>
                </Col>
                <Col>
                    <div className={styles.qrCodeContainer}>
                        <h2>Qr Code to Login</h2>
                        <Qrcode user={user} />

                    </div>
                </Col>
            </Row>
        </Container>
    );
};