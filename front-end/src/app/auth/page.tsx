"use client";
import React, { useState } from "react";
import LoginForm from "../Components/Login/login-form";
import RegisterForm from "../Components/Register/register-form";
import styles from "./Auth.module.css";

export default function Page() {
    const [mode, setMode] = useState<"login" | "register" | "initial">("register");

    return (
        <div className={styles.container}>
            <div className={styles.backgroundContent}></div>

            <div className={styles.content}>
                {mode === "initial" && (
                    <div
                        key="login"
                        className={styles.formLogin}
                    >
                        <div
                            className={styles.forms}>
                            <LoginForm onSwitch={() => setMode("register")} />
                        </div>

                        <div
                            key={mode === "initial" ? "bg-initial" : "bg-initial"}
                            className={styles.backgroundImg}
                        >
                            <div
                                className={styles.rights}>
                                <h3>seu sonho, nossa criação</h3>
                            </div>
                        </div>
                    </div>
                )}

                {mode === "login" && (
                    <div
                        key="register"
                        className={styles.formLogin}
                    >
                        <div
                            key={mode === "login" ? "bg-login" : "bg-register"}
                            className={styles.backgroundImg}
                        >
                            <div className={styles.filter
                            }>
                                <div className={styles.rights}>
                                    <h3>seu sonho, nossa criação</h3>
                                    <p>Cada detalhe pensado para destacar o sabor do seu negócio.</p>
                                    <div className={styles.details}>
                                        <div id={styles.detailOne}></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.forms}>
                            <LoginForm onSwitch={() => setMode("register")} />
                        </div>

                    </div>
                )}
                {mode === "register" && (
                    <div
                        key="register"
                        className={styles.formRegister}
                    >
                        <div
                            key={mode === "register" ? "bg-register" : "bg-login"}
                            className={styles.backgroundImg}
                        >
                            <div className={styles.filter
                            }>
                                <div className={styles.rights}>
                                    <h3>seu sonho, nossa criação</h3>
                                    <p>Cada detalhe pensado para destacar o sabor do seu negócio.</p>
                                    <div className={styles.details}>
                                        <div id={styles.detailOne}></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.forms}>
                            <RegisterForm onSwitch={() => setMode("login")} />
                        </div>

                    </div>
                )}
            </div >
        </div >
    )
}              