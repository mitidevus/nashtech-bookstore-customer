import { Order, SortBy } from "constants/sort";
import { GetListResult } from "types/app";
import { Book } from "types/book";
import { RatingCount, RatingReview } from "types/rating-review";
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
    getBookDetail: build.query<Book, string>({
      query: (slug) => `books/slug/${slug}`,
    }),
    getRatingReviews: build.query<
      GetListResult<RatingReview> & { ratingCount: RatingCount },
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
  }),
});

export const {
  useGetBooksQuery,
  useLazyGetBooksQuery,
  useGetBookDetailQuery,
  useLazyGetBookDetailQuery,
  useGetRatingReviewsQuery,
  useLazyGetRatingReviewsQuery,
} = bookApiSlice;
