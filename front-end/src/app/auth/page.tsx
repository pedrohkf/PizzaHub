"use client";
import React, { useState } from "react";
import LoginForm from "../Components/Login/login-form";
import RegisterForm from "../Components/Register/register-form";
import styles from "./Auth.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
    const [mode, setMode] = useState<"login" | "register" | "initial">("initial");

    return (
        <div className={styles.container}>
            <div className={styles.backgroundContent}></div>

            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    {mode === "initial" && (
                        <div
                            key="login"
                            className={styles.formLogin}
                        >

                            <motion.div
                                className={styles.forms}>
                                <LoginForm onSwitch={() => setMode("register")} />
                            </motion.div>

                            <div
                                key={mode === "initial" ? "bg-initial" : "bg-initial"}
                                className={styles.backgroundImg}
                            >
                                <motion.div
                                    className={styles.rights}>
                                    <p>Direitos reservados a Bit-ai, criadora do projeto</p>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {mode === "login" && (
                        <div
                            key="login"
                            className={styles.formLogin}
                        >

                            <motion.div
                                className={styles.forms}
                                initial={{ x: 420 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 1.8, ease: [0.1, 0.6, 0.2, 1] }}>
                                <LoginForm onSwitch={() => setMode("register")} />
                            </motion.div>

                            <div
                                key={mode === "login" ? "bg-login" : "bg-register"}
                                className={styles.backgroundImg}
                            >
                                <motion.div
                                    className={styles.rights}
                                    initial={{ x: -420 }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 1.8, ease: [0.1, 0.6, 0.2, 1] }}>
                                    <p>Direitos reservados a Bit-ai, criadora do projeto</p>
                                </motion.div>
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
                                <motion.div className={styles.rights}
                                    initial={{ x: 420 }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 1.8, ease: [0.1, 0.6, 0.2, 1] }}>
                                    <p>Direitos reservados a Bit-ai, criadora do projeto</p>
                                </motion.div>
                            </div>
                            <motion.div className={styles.forms}
                                initial={{ x: -420 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 1.8, ease: [0.1, 0.6, 0.2, 1] }}>
                                <RegisterForm onSwitch={() => setMode("login")} />
                            </motion.div>

                        </div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    )
}              