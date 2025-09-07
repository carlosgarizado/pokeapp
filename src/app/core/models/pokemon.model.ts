export interface PokemonListResponse {
    count: number; 
    next: string | null; 
    previous: string | null;
    results: PokemonBasic[];
  }
  
  export interface PokemonBasic {
    name: string; 
    url: string; 
  }

  export interface Pokemon {
    name: string; 
    img: string; 
    id: number; 
    color : string
  }
  
  export interface DetailPokemon {
    id: number;
    name: string;
    types: string[];
    weight: string;
    sprites: string[];
    moves: string[];
    color: string;
  }
  
  
  export interface PokemonApiResponse {
    id: number;
    name: string;
    weight: number;
    sprites: {
      front_default: string;
      back_default: string;
      front_shiny: string;
      back_shiny: string;
    };
    types: { slot: number; type: { name: string; url: string } }[];
    moves: { move: { name: string; url: string } }[];
  }