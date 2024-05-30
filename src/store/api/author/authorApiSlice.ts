import { SortBy } from "constants/sort";
import { GetListResult } from "types/app";
import { Author } from "types/author";
import { Book } from "types/book";
import { apiSlice } from "../baseApiSlice";

const authorApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAuthors: build.query<Author[], void>({
      query: () => "authors",
      transformResponse: (response: { data: Author[] }) => response.data,
    }),
    getBooksByAuthorSlug: build.query<
      Author & { books: GetListResult<Book> },
      {
        slug: string;
        page: number;
        take: number;
        sort?: SortBy;
      }
    >({
      query: ({ slug, page, take, sort }) => ({
        url: `authors/${slug}/books`,
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
  useGetAuthorsQuery,
  useLazyGetAuthorsQuery,
  useGetBooksByAuthorSlugQuery,
  useLazyGetBooksByAuthorSlugQuery,
} = authorApiSlice;
