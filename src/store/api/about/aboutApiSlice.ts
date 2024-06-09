import { apiSlice } from "../baseApiSlice";

const aboutApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAbout: build.query<string, void>({
      query: () => "about",
      transformResponse: (response: { content: string }) => response.content,
    }),
  }),
});

export const { useGetAboutQuery, useLazyGetAboutQuery } = aboutApiSlice;
