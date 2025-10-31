"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import CardapioForm from "@/app/Components/Pizzaria/Cardapio-Form/cardapio";
import { useAuth } from "@/context/AuthContext";

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
  _id?: string;
  categorias: Categoria[];
  nome?: string;
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
  cardapioId?: string;
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { user } = useAuth();

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
  const [selectedCardapioId, setSelectedCardapioId] = useState<string | null>(null);

  // Buscar pizzaria
  useEffect(() => {
    if (!id) return;
    async function fetchPizzaria() {
      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`);
      const data = await res.json();
      setPizzaria(data);
      setLogo(data.logo || "");
      setBannerImage(data.bannerImage || "");
      setSlogan(data.slogan || "");
      setDescription(data.description || "");
      setGallery(data.gallery || []);
      setInstagram(data.socialLinks?.instagram || "");
      setWhatsapp(data.socialLinks?.whatsapp || "");
      setWebsite(data.socialLinks?.website || "");
      setSelectedCardapioId(data.cardapioId || null);
    }
    fetchPizzaria();
  }, [id]);

  // Buscar cardapios do usuário
  useEffect(() => {
    async function fetchUserCardapios() {
      if (!user?.id) return;
      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/cardapios/${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserCardapios(data);
      } else {
        setUserCardapios([]); // previne erro de map
      }
    }
    fetchUserCardapios();
  }, [user?.id]);

  // Salvar alterações
  async function handleSave() {
    if (!pizzaria) return;

    const updated = {
      ...pizzaria,
      logo,
      bannerImage,
      slogan,
      description,
      gallery,
      socialLinks: { instagram, whatsapp, website },
      cardapioId: selectedCardapioId,
    };

    const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert("Pizzaria atualizada com sucesso!");
      router.refresh();
    } else {
      alert("Erro ao salvar.");
    }
  }

  if (!pizzaria) return <p>Carregando...</p>;

  return (
    <div className={styles.editorPage}>
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
        <input value={gallery.join(", ")} onChange={(e) => setGallery(e.target.value.split(",").map((s) => s.trim()))} />
        <h3>Redes sociais</h3>
        <label>Instagram</label>
        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        <label>WhatsApp</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <label>Website</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} />

        <h3>Cardápio</h3>
        <div className={styles.cardapioList}>
          {userCardapios.length === 0 && <p>Você ainda não possui cardápios.</p>}
          {userCardapios.map((c) => (
            <div key={c._id} className={styles.cardapioItem}>
              <span>{c.nome || "Cardápio sem nome"}</span>
              <button
                onClick={() => setSelectedCardapioId(c._id!)}
                className={selectedCardapioId === c._id ? styles.selectedBtn : ""}
              >
                {selectedCardapioId === c._id ? "Selecionado" : "Selecionar"}
              </button>
            </div>
          ))}
        </div>

        <CardapioForm />

        <button onClick={handleSave} className={styles.saveBtn}>Salvar alterações</button>
      </section>
    </div>
  );
}
