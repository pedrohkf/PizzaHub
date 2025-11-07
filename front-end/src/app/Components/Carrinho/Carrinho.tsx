// Cart.tsx
import React from "react";
import styles from "./Cart.module.css"; // pode criar estilos separados
import { Pizza } from "@/types/Pizza";



interface CartProps {
  cart: Pizza[];
  setCart: React.Dispatch<React.SetStateAction<Pizza[]>>;
}

export default function Cart({ cart, setCart }: CartProps) {
  const total = cart.reduce((sum, pizza) => sum + pizza.precoMedia, 0);

  function removeFromCart(index: number) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  return (
    <section className={styles.cartSection}>
      <h3>🛒 Seu Carrinho</h3>
      {cart.length === 0 ? (
        <p>Nenhum item no carrinho</p>
      ) : (
        <>
          <ul>
            {cart.map((pizza, i) => (
              <li key={i}>
                {pizza.nome} — R$ {pizza.precoMedia.toFixed(2)}
                <button onClick={() => removeFromCart(i)}>Remover</button>
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>
        </>
      )}
    </section>
  );
}
