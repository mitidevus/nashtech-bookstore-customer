import { Author } from "./author";
import { Category } from "./category";
import { PromotionList } from "./promotion-list";

export type Book = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  finalPrice: number;
  discountDate: string | null;
  avgStars: number;
  totalReviews: number;
  soldQuantity: number;
  authors: Author[];
  categories: Category[];
  promotionList: PromotionList;
};
