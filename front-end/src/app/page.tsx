import Image from "next/image";
import Menu from "./Components/Menu";
import Pizza from "../../public/imgs/pizza.png"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.title}>
        <h1>Crie sua pizzaria online</h1>
      </div>
      <Image src={Pizza} alt="" />
    </div>
  );
}
