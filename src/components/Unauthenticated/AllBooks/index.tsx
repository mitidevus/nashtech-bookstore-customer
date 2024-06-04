import BookList from "components/Common/BookList";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import ShopLayout from "components/Common/Layout/ShopLayout";
import { SortBy } from "constants/sort";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLazyGetBooksQuery } from "store/api/book/bookApiSlice";
import { Book } from "types/book";

export default function AllBooks() {
  const [data, setData] = useState<{
    books: Book[];
    totalPages: number;
    totalCount: number;
  }>({ books: [], totalPages: 1, totalCount: 0 });

  const [searchParams] = useSearchParams();
  const rating = searchParams.get("rating");

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(8);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);

  const [getBooks, { isLoading }] = useLazyGetBooksQuery();

  useEffect(() => {
    (async () => {
      try {
        console.log(rating);

        const { data, totalPages, totalCount } = await getBooks({
          page,
          take,
          sort: sortBy === SortBy.NONE ? undefined : sortBy,
          rating: rating ? parseInt(rating) : undefined,
        }).unwrap();

        setData({ books: data, totalPages, totalCount });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [getBooks, page, rating, sortBy, take]);

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs />

      <ShopLayout>
        <BookList
          title="Books"
          {...data}
          page={page}
          setPage={setPage}
          take={take}
          setTake={setTake}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </ShopLayout>
    </>
  );
}
