import { SortBy } from "constants/sort";
import { GetList } from "types/app";
import { Book } from "types/book";
import { Category } from "types/category";
import { apiSlice } from "../baseApiSlice";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => "categories",
      transformResponse: (response: { data: Category[] }) => response.data,
    }),
    getBooksByCategorySlug: build.query<
      Category & { books: GetList<Book> },
      {
        slug: string;
        page: number;
        take: number;
        sort?: SortBy;
      }
    >({
      query: ({ slug, page, take, sort }) => ({
        url: `categories/${slug}/books`,
        params: {
          page,
          take,
          sort,
        },
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetBooksByCategorySlugQuery,
  useLazyGetBooksByCategorySlugQuery,
} = categoryApiSlice;
