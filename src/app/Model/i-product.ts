import { IRating } from "./irating";

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity?: number;
  color?: string;   
  size?:number;
  localCategory?: string;
}

