import { SpecialBook } from "constants/book";
import { Order, SortBy } from "constants/sort";
import { GetList } from "types/app";
import { Book } from "types/book";
import { RatingCount, RatingReview } from "types/rating-review";
import { apiSlice } from "../baseApiSlice";

const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<
      GetList<Book>,
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
    getSpecialBooks: build.query<
      Book[],
      {
        page: number;
        take: number;
        type: SpecialBook;
      }
    >({
      query: ({ page, take, type }) => ({
        url: `books/special`,
        params: {
          page,
          take,
          type,
        },
      }),
      transformResponse: (response: { data: Book[] }) => response.data,
    }),
    getBookDetail: build.query<Book, string>({
      query: (slug) => `books/slug/${slug}`,
    }),
    getRatingReviews: build.query<
      GetList<RatingReview> & { ratingCount: RatingCount },
      {
        slug: string;
        page: number;
        take: number;
        order: Order;
        star?: number;
      }
    >({
      query: ({ slug, page, take, order, star }) => ({
        url: `books/${slug}/rating-reviews`,
        params: {
          page,
          take,
          order,
          star,
        },
      }),
    }),
    addRatingReview: build.mutation<
      RatingReview,
      { slug: string; star: number; title: string; content: string }
    >({
      query: ({ slug, star, title, content }) => ({
        url: `books/${slug}/rating-reviews`,
        method: "POST",
        body: {
          star,
          title,
          content,
        },
      }),
    }),
  }),
});

export const {
  useGetBooksQuery,
  useLazyGetBooksQuery,
  useGetSpecialBooksQuery,
  useLazyGetSpecialBooksQuery,
  useGetBookDetailQuery,
  useLazyGetBookDetailQuery,
  useGetRatingReviewsQuery,
  useLazyGetRatingReviewsQuery,
  useAddRatingReviewMutation,
} = bookApiSlice;
