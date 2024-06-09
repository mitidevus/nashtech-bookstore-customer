import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import BookList from "components/Common/BookList";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import { SortBy } from "constants/sort";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAuthorsQuery } from "store/api/author/authorApiSlice";
import { useLazyGetBooksQuery } from "store/api/book/bookApiSlice";
import { useGetCategoriesQuery } from "store/api/category/categoryApiSlice";
import { Author } from "types/author";
import { Book } from "types/book";
import { Category } from "types/category";
import { ScrollbarStyle } from "utils/style";

function SearchableAccordion({
  title,
  items,
  queryParam,
}: {
  title: string;
  items: Author[] | Category[];
  queryParam: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredItems = useMemo(
    () =>
      items?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [items, searchQuery]
  );

  const handleItemClick = useCallback(
    (slug: string) => {
      const currentSearchParams = new URLSearchParams(searchParams);
      const slugs = currentSearchParams.get(queryParam)?.split(",") || [];
      const updatedSlugs = slugs.includes(slug)
        ? slugs.filter((s) => s !== slug)
        : [...slugs, slug];

      if (updatedSlugs.length === 0) {
        currentSearchParams.delete(queryParam);
      } else {
        currentSearchParams.set(queryParam, updatedSlugs.join(","));
      }

      setSearchParams(currentSearchParams);
    },
    [searchParams, setSearchParams, queryParam]
  );

  const isChecked = useCallback(
    (slug: string) => {
      const currentSearchParams = new URLSearchParams(searchParams);
      const slugs = currentSearchParams.get(queryParam)?.split(",") || [];
      return slugs.includes(slug);
    },
    [searchParams, queryParam]
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails
        sx={{ maxHeight: 400, overflowY: "auto", ...ScrollbarStyle }}
      >
        {items?.length > 0 ? (
          <>
            <TextField
              fullWidth
              size="small"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ my: 2 }}
            />
            <Grid container direction="column">
              {filteredItems.map((item) => (
                <FormControlLabel
                  key={item.slug}
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked(item.slug)}
                      onChange={() => handleItemClick(item.slug)}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: isChecked(item.slug)
                          ? "primary.main"
                          : "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item.name}
                    </Typography>
                  }
                />
              ))}
            </Grid>
          </>
        ) : (
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            No {title.toLowerCase()}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("search");
  const author = searchParams.get("author");
  const category = searchParams.get("category");
  const rating = searchParams.get("rating");

  const [data, setData] = useState<{
    books: Book[];
    totalPages: number;
    totalCount: number;
  }>({ books: [], totalPages: 1, totalCount: 0 });
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(8);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);

  const { data: authors, isLoading: fetchingAuthor } = useGetAuthorsQuery();
  const { data: categories, isLoading: fetchingCategory } =
    useGetCategoriesQuery();
  const [getBooks, { isLoading }] = useLazyGetBooksQuery();

  useEffect(() => {
    (async () => {
      try {
        const { data, totalPages, totalCount } = await getBooks({
          page,
          take,
          sort: sortBy === SortBy.NONE ? undefined : sortBy,
          rating: rating ? parseInt(rating) : undefined,
          search: keyword || undefined,
          author: author || undefined,
          category: category || undefined,
        }).unwrap();
        setData({ books: data, totalPages, totalCount });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [author, category, getBooks, keyword, page, rating, sortBy, take]);

  const handleRatingFilterClick = useCallback(
    (selectedRating: number) => {
      const currentSearchParams = new URLSearchParams(searchParams);
      const currentRating = currentSearchParams.get("rating");

      if (currentRating && parseInt(currentRating) === selectedRating) {
        currentSearchParams.delete("rating");
      } else {
        currentSearchParams.set("rating", `${selectedRating}`);
      }

      setSearchParams(currentSearchParams);
    },
    [searchParams, setSearchParams]
  );

  if (isLoading || fetchingAuthor || fetchingCategory) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2.5} sx={{ minWidth: { xs: 615, md: 0 } }}>
          <SearchableAccordion
            title="Author"
            items={authors as Author[]}
            queryParam="author"
          />
          <SearchableAccordion
            title="Category"
            items={categories as Category[]}
            queryParam="category"
          />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-content"
              id="panel-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Rating Review
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Grid container direction="column">
                {[5, 4, 3, 2, 1].map((item) => (
                  <Typography
                    key={item}
                    variant="subtitle2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1,
                      color:
                        item === parseInt(rating as string)
                          ? "primary.main"
                          : "text.secondary",
                      "&:hover": { color: "primary.main", cursor: "pointer" },
                    }}
                    onClick={() => handleRatingFilterClick(item)}
                  >
                    {item === 5 ? "5 stars" : `From ${item} stars`}
                    <Rating
                      name="avgStars"
                      value={item}
                      size="small"
                      readOnly
                    />
                  </Typography>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={9.5}>
          <BookList
            title={keyword ? `Search results for "${keyword}"` : "Books"}
            {...data}
            page={page}
            setPage={setPage}
            take={take}
            setTake={setTake}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </Grid>
      </Grid>
    </>
  );
}
