import { Author } from "types/author";
import { apiSlice } from "../baseApiSlice";

const authorApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAuthors: build.query<Author[], void>({
      query: () => "authors",
      transformResponse: (response: { data: Author[] }) => response.data,
    }),
  }),
});

export const { useGetAuthorsQuery, useLazyGetAuthorsQuery } = authorApiSlice;
