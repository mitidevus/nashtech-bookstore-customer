import { Category } from "types/category";
import { apiSlice } from "../baseApiSlice";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => "categories",
      transformResponse: (response: { data: Category[] }) => response.data,
    }),
  }),
});

export const { useGetCategoriesQuery, useLazyGetCategoriesQuery } =
  categoryApiSlice;
