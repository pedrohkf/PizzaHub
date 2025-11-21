"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import CardapioForm from "@/app/Components/Pizzaria/Cardapio-Form/cardapio";
import { useAuth } from "@/context/AuthContext";
import Back from "../../../../../../public/imgs/Back";

// Tipos
interface Pizza {
  nome: string;
  descricao: string;
  precoPequena: number;
  precoMedia: number;
  precoGrande: number;
  imagem: string;
  destaque: boolean;
  disponivel: boolean;
}

interface Categoria {
  nome: string;
  pizzas: Pizza[];
}

interface Cardapio {
  _id: string;
  categorias: Categoria[];
  userId: string;
}

interface Pizzaria {
  name: string;
  phone: string;
  openingHours: string;
  numberHouse: string;
  street: string;
  neighborhood: string;
  state: string;
  deliveryFee: string;
  methodPay: "dinheiro" | "pix" | "cartão";
  logo: string;
  bannerImage: string;
  gallery: string[];
  slogan: string;
  description: string;
  socialLinks: {
    instagram: string;
    whatsapp: string;
    website: string;
  };
  cardapioSelecionado?: string[]; // _id do cardápio selecionado
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();

  // Estados principais
  const [pizzaria, setPizzaria] = useState<Pizzaria | null>(null);
  const [logo, setLogo] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");

  const [userCardapios, setUserCardapios] = useState<Cardapio[]>([]);
  const [selectedCardapios, setSelectedCardapios] = useState<string[]>([]);


  // Buscar dados da pizzaria
  useEffect(() => {
    if (!id) return;
    async function fetchPizzaria() {
      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`);
      const data = await res.json();

      console.log("Pizzaria carregada do backend:", data);

      setPizzaria(data);
      setLogo(data.logo || "");
      setBannerImage(data.bannerImage || "");
      setSlogan(data.slogan || "");
      setDescription(data.description || "");
      setGallery(data.gallery || []);
      setInstagram(data.socialLinks?.instagram || "");
      setWhatsapp(data.socialLinks?.whatsapp || "");
      setWebsite(data.socialLinks?.website || "");
      setSelectedCardapios(data.cardapio || null);
    }
    fetchPizzaria();
  }, [id]);


  // Buscar todos os cardápios do usuário
  useEffect(() => {
    async function fetchUserCardapios() {
      if (!user?.id) return;
      console.log("Buscando cardápios do usuário com ID:", user.id);

      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/cardapio/${user.id}`);
      const data = await res.json();

      console.log("Resposta do backend:", data);

      if (Array.isArray(data)) {
        console.log("Cardápios recebidos:", data.map(c => c._id));
        setUserCardapios(data);
      } else {
        setUserCardapios([]);
      }
    }
    fetchUserCardapios();
  }, [user?.id]);


  // Função para salvar alterações
  async function handleSave() {
    console.log("Selected Cardápio ID ao salvar:", selectedCardapios);
    if (!pizzaria) return;

    const updated = {
      ...pizzaria,
      logo,
      bannerImage,
      slogan,
      description,
      gallery,
      socialLinks: { instagram, whatsapp, website },
      cardapio: selectedCardapios, // envia o _id do cardápio
    };

    try {
      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        alert("Pizzaria atualizada com sucesso!");
        router.refresh();
      } else {
        const errText = await res.text();
        console.error("Erro no backend:", errText);
        alert("Erro ao salvar. Verifique o console.");
      }
    } catch (err) {
      console.error("Erro ao atualizar pizzaria:", err);
      alert("Erro de conexão ao salvar.");
    }
  }

  if (!pizzaria) return <p>Carregando...</p>;

  return (
    <div className={styles.editorPage}>
      <div className={styles.buttonBack} onClick={() => router.push("/pizzahub/pizzarias")}>
        <Back />
      </div>
      <section className={styles.formSection}>
        <h2>Editar Pizzaria</h2>

        <label>Logo (URL)</label>
        <input value={logo} onChange={(e) => setLogo(e.target.value)} />

        <label>Banner (URL)</label>
        <input value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} />

        <label>Slogan</label>
        <input value={slogan} onChange={(e) => setSlogan(e.target.value)} />

        <label>Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Galeria (URLs separados por vírgula)</label>
        <input
          value={gallery.join(", ")}
          onChange={(e) => setGallery(e.target.value.split(",").map((s) => s.trim()))}
        />

        <h3>Redes sociais</h3>
        <label>Instagram</label>
        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} />

        <label>WhatsApp</label>
        <input value={whatsapp} type="number" onChange={(e) => setWhatsapp(e.target.value)} />

        <label>Email</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} />

        <h3>Categorias do seu Cardápio</h3>
        <div className={styles.cardapioList}>
          {userCardapios.length === 0 && <p>Você ainda não possui cardápios.</p>}
          {userCardapios.map((cardapio) =>
            cardapio.categorias.map((cat, index) => (
              <div key={cardapio._id + index} className={styles.cardapioItem}>
                <span>{cat.nome}</span>
                <button
                  onClick={() => {
                    if (selectedCardapios.includes(cardapio._id)) {
                      // Remove se já estiver selecionado
                      setSelectedCardapios(selectedCardapios.filter(id => id !== cardapio._id));
                    } else {
                      // Adiciona se ainda não estiver
                      setSelectedCardapios([...selectedCardapios, cardapio._id]);
                    }
                    console.log("Cardápios selecionados:", selectedCardapios);
                  }}
                  className={selectedCardapios.includes(cardapio._id) ? styles.selectedBtn : ""}
                >
                  {selectedCardapios.includes(cardapio._id) ? "Selecionado" : "Selecionar"}
                </button>


              </div>
            ))
          )}
        </div>

        <CardapioForm />

        <button onClick={handleSave} className={styles.saveBtn}>
          Salvar alterações
        </button>
      </section>

      <section className={styles.previewSection}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.logoMenu}>
            {logo && <img src={logo} alt="Logo" className={styles.logo} />}
            <nav className={styles.nav}>
              <a href="#sobre">Sobre</a>
              <a href="#galeria">Galeria</a>
              <a href="#cardapio">Cardápio</a>
              <a href="#contato">Contato</a>
            </nav>
          </div>
        </header>

        {/* BANNER */}
        {bannerImage && (
          <div className={styles.bannerWrapper}>
            <img src={bannerImage} alt="Banner" className={styles.banner} />
            <div className={styles.bannerText}>
              <h1>{slogan || "Slogan da Pizzaria"}</h1>
              <button className={styles.orderBtn}
                onClick={() => router.push(`cardapio`)}> Peça Agora</button>
            </div>
          </div>
        )
        }

        {/* INFORMAÇÕES DA PIZZARIA */}
        <section className={styles.infoSection}>
          <h2>Informações</h2>
          <p><strong>Telefone:</strong> {pizzaria.phone}</p>
          <p><strong>Endereço:</strong> {pizzaria.street}, {pizzaria.numberHouse} - {pizzaria.neighborhood}, {pizzaria.state}</p>
          <p><strong>Horário de Funcionamento:</strong> {pizzaria.openingHours}</p>
          <p><strong>Taxa de Entrega:</strong> R$ {pizzaria.deliveryFee}</p>
          <p><strong>Métodos de Pagamento:</strong> {pizzaria.methodPay}</p>
        </section>

        {/* GALERIA */}
        <section id="galeria" className={styles.gallerySection}>
          <h2>Galeria</h2>
          <div className={styles.galleryGrid}>
            {gallery.map((url, i) => (
              <div className={styles.galleryItem} key={i}>
                <img src={url} alt={`Imagem ${i}`} />
              </div>
            ))}
          </div>
        </section>

        <section id="cardapio" className={styles.cardapioPreview}>
          <h2>Cardápios Selecionados</h2>
          {userCardapios
            .filter(c => selectedCardapios.includes(c._id))
            .map((cardapio) =>
              cardapio.categorias.map((cat, index) => (
                <div key={cardapio._id + index} className={styles.categoryCard}>
                  <h3>{cat.nome}</h3>
                  <div className={styles.pizzasGrid}>
                    {cat.pizzas.map((pizza, i) => (
                      <div key={i} className={styles.pizzaCard}>
                        <h4>{pizza.nome}</h4>
                        <p>{pizza.descricao}</p>
                        <div className={styles.priceAndBuy}>
                          <span>Média: R$ {pizza.precoMedia.toFixed(2)}</span>
                          <button className={styles.buyBtn} onClick={() => router.push(`cardapio`)}>Comprar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
        </section>


        {/* SOBRE */}
        <section id="sobre" className={styles.sobre}>
          <h2>Sobre Nós</h2>
          <p>{description || "Aqui vai uma descrição da pizzaria, sua história, ingredientes especiais e missão."}</p>
        </section>

        {/* CARDÁPIO / PRODUTOS */}

        {/* CONTATO */}
        <section id="contato" className={styles.contato}>
          <h2>Contato</h2>
          <div className={styles.socialLinks}>
            {instagram && <a href={instagram} className={styles.socialBtn} target="_black">Instagram</a>}
            {whatsapp && <a
              href={'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent('Olá, quero fazer um pedido!')}
              className={styles.socialBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>}
            {website && <a href={website} className={styles.socialBtn}  target="_black">Website</a>}
          </div>
        </section>
      </section >
    </div >
  );
}
