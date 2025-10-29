"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";

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
}

interface EditPageProps {
  params: { id: string };
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams(); // agora params é uma função do router
  const id = params?.id;      // pega o id dinamicamente

  const [pizzaria, setPizzaria] = useState<Pizzaria | null>(null);

  // campos individuais para live preview
  const [logo, setLogo] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");

  // no useEffect
  useEffect(() => {
    if (!id) return;
    async function fetchPizzaria() {
      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`);
      const data = await res.json();
      setPizzaria(data);

      // ⚡ Atualiza os campos do live preview
      setLogo(data.logo || "");
      setBannerImage(data.bannerImage || "");
      setSlogan(data.slogan || "");
      setDescription(data.description || "");
      setGallery(data.gallery || []);
      setInstagram(data.socialLinks?.instagram || "");
      setWhatsapp(data.socialLinks?.whatsapp || "");
      setWebsite(data.socialLinks?.website || "");
    }
    fetchPizzaria();
  }, [id]);

  // salvar alterações
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
      {/* FORMULÁRIO DE EDIÇÃO */}
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
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <label>Website</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} />

        <button onClick={handleSave} className={styles.saveBtn}>
          Salvar alterações
        </button>
      </section>

      {/* PREVIEW VISUAL DO SITE */}
      <section className={styles.previewSection}>
        <header className={styles.header}>
          <div className={styles.logoMenu}>
            {logo && <img src={logo} alt="Logo" className={styles.logo} />}
            <nav className={styles.nav}>
              <a href="#sobre">Sobre</a>
              <a href="#galeria">Galeria</a>
              <a href="#contato">Contato</a>
            </nav>
          </div>
        </header>

        {bannerImage && (
          <div className={styles.bannerWrapper}>
            <img src={bannerImage} alt="Banner" className={styles.banner} />
            <div className={styles.bannerText}>
              <h1>{slogan || "Slogan da Pizzaria"}</h1>
            </div>
          </div>
        )}

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

        <section id="sobre" className={styles.sobre}>
          <h2>Sobre Nós</h2>
          <p>{description || "Aqui vai uma descrição da pizzaria, sua história, ingredientes especiais e missão."}</p>
        </section>



        <section id="contato" className={styles.contato}>
          <h2>Contato</h2>
          <div className={styles.socialLinks}>
            {instagram && <a href={instagram} className={styles.socialBtn}>Instagram</a>}
            {whatsapp && <a href={whatsapp} className={styles.socialBtn}>WhatsApp</a>}
            {website && <a href={website} className={styles.socialBtn}>Website</a>}
          </div>
        </section>
      </section>
    </div>
  );
}
