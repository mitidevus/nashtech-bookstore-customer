import { SortBy } from "constants/sort";
import { GetListResult } from "types/app";
import { Book } from "types/book";
import { apiSlice } from "../baseApiSlice";

const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<
      GetListResult<Book>,
      {
        page: number;
        take: number;
        sort?: SortBy;
      }
    >({
      query: ({ page, take, sort }) => ({
        url: `books`,
        params: {
          page,
          take,
          sort,
        },
      }),
    }),
  }),
});

export const { useGetBooksQuery, useLazyGetBooksQuery } = bookApiSlice;
