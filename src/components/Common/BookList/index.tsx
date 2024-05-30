import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Rating,
  Select,
  Typography,
} from "@mui/material";
import { SortBy } from "constants/sort";
import { useEffect, useState } from "react";
import { useLazyGetBooksQuery } from "store/api/book/bookApiSlice";
import { Book } from "types/book";
import { formatCurrency } from "utils/currency";
import CenterLoading from "../CenterLoading";

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [take, setTake] = useState(8);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);

  const [getBooks, { isLoading }] = useLazyGetBooksQuery();

  useEffect(() => {
    (async () => {
      try {
        const { data, totalPages } = await getBooks({
          page,
          take,
          sort: sortBy === SortBy.NONE ? undefined : sortBy,
        }).unwrap();

        setBooks(data);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [getBooks, page, sortBy, take]);

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel id="sort-by">Sort by</InputLabel>
          <Select
            labelId="sort-by"
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            label="Sort by"
            size="small"
          >
            <MenuItem value={SortBy.NONE}>None</MenuItem>
            <MenuItem value={SortBy.ON_SALE}>On Sale</MenuItem>
            <MenuItem value={SortBy.POPULAR}>Popularity</MenuItem>
            <MenuItem value={SortBy.ASC_PRICE}>Price: Low to High</MenuItem>
            <MenuItem value={SortBy.DESC_PRICE}>Price: High to Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="take-items">Show</InputLabel>
          <Select
            labelId="take-items"
            id="take-items"
            value={take}
            onChange={(e) => setTake(e.target.value as number)}
            label="Show"
            size="small"
          >
            <MenuItem value={8}>8 items</MenuItem>
            <MenuItem value={12}>12 items</MenuItem>
            <MenuItem value={16}>16 items</MenuItem>
            <MenuItem value={20}>20 items</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid item xs={6} sm={4} lg={3} key={book.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                minHeight: 380,
                position: "relative",
              }}
            >
              <img
                src={book.image}
                alt={book.name}
                style={{ width: "100%", height: "auto" }}
              />

              {book.discountPrice > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#F04438",
                    padding: "4px 8px",
                    borderRadius: "0 0 0 8px",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "white" }}>
                    {`-${book.promotionList.discountPercentage}%`}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.primary",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: 50,
                  }}
                >
                  {book.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "error.main",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(
                      book.discountPrice > 0
                        ? book.discountPrice * 1000
                        : book.price * 1000
                    )}
                  </Typography>

                  {book.discountPrice > 0 && (
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#D0D5DD",
                        textDecoration: "line-through",
                        fontWeight: "normal",
                      }}
                    >
                      {formatCurrency(book.price * 1000)}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Rating
                    name="avgStars"
                    value={book.avgStars}
                    size="small"
                    readOnly
                  />

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    ({book.totalReviews})
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                  }}
                >
                  Add to cart
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{
          mt: 2,
        }}
      />
    </Box>
  );
}
