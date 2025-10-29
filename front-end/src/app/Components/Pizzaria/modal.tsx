"use client";
import { useState } from "react";
import styles from "./modal.module.css";
import PizzariaForm from "../Pizzaria/Form/Form";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          <PizzariaForm onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
