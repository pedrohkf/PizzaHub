import Logo from "../../../public/imgs/logo";
import styles from "./Menu.module.css";

export default function Menu(){
    return (
        <div className={styles.menu}>
            <div className={styles.logo}>
                <Logo />
                <p>PizzaHub</p>
            </div>
            <div className={styles.links}>
                <p>Início</p>
                <p>Modelos</p>
                <p>Como funciona</p>
                <p>Planos</p>
                <p>Sobre nós</p>
            </div>
            <div className={styles.suporte}>
                <a href="/auth"><button>Entrar</button></a>
                <a href="/auth"><button>Começar</button></a>
            </div>
        </div>
    )
}