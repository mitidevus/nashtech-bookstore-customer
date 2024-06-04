import BookList from "components/Common/BookList";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import ShopLayout from "components/Common/Layout/ShopLayout";
import { SortBy } from "constants/sort";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyGetBooksByAuthorSlugQuery } from "store/api/author/authorApiSlice";
import { Book } from "types/book";

export default function BooksByAuthor() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const [data, setData] = useState<{
    title: string;
    books: Book[];
    totalPages: number;
    totalCount: number;
  }>({
    title: "Author",
    books: [],
    totalPages: 1,
    totalCount: 0,
  });

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(8);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);

  const [getBooks, { isLoading }] = useLazyGetBooksByAuthorSlugQuery();

  useEffect(() => {
    (async () => {
      if (slug) {
        try {
          const res = await getBooks({
            slug,
            page,
            take,
            sort: sortBy === SortBy.NONE ? undefined : sortBy,
          }).unwrap();

          setData({
            title: res.name,
            books: res.books.data,
            totalPages: res.books.totalPages,
            totalCount: res.books.totalCount,
          });
        } catch (error) {
          navigate("/shop");
          return;
        }
      } else {
        navigate("/shop");
        return;
      }
    })();
  }, [getBooks, navigate, page, slug, sortBy, take]);

  const customRoutes = [
    {
      path: `/shop/author/${slug}`,
      breadcrumb: data.title,
    },
  ];

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs customRoutes={customRoutes} />

      <ShopLayout>
        <BookList
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
