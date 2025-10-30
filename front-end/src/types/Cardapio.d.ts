// src/types/cardapio.ts
export interface CardapioFormData {
  categorias: {
    nome: string;
    pizzas: {
      nome: string;
      descricao: string;
      precoPequena: number;
      precoMedia: number;
      precoGrande: number;
      imagem: string;
      destaque: boolean;
      disponivel: boolean;
    }[];
  }[];
}
