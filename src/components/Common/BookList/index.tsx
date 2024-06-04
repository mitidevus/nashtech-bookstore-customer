import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { SortBy } from "constants/sort";
import { Book } from "types/book";
import BookItem from "../BookItem";
import NoData from "../NoData";

export default function BookList({
  title = "Books",
  image,
  books,
  page,
  setPage,
  take,
  setTake,
  sortBy,
  setSortBy,
  totalPages,
  totalCount,
}: {
  title?: string;
  image?: string;
  books: Book[];
  page: number;
  setPage: (page: number) => void;
  take: number;
  setTake: (take: number) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  totalPages: number;
  totalCount: number;
}) {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            gap: 1,

            "& span": {
              color: "text.secondary",
              fontWeight: 400,
            },
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt="book"
              sx={{
                width: 50,
                height: 50,
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "50%",
              }}
            />
          )}

          {title}
          <span> ({totalCount})</span>
        </Typography>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 180, ml: 2 }}>
            <InputLabel id="sort-by">Sort by</InputLabel>
            <Select
              labelId="sort-by"
              id="sort-by"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortBy);
                setPage(1);
              }}
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
              onChange={(e) => {
                setTake(e.target.value as number);
                setPage(1);
              }}
              label="Show"
              size="small"
            >
              <MenuItem value={8}>8 items</MenuItem>
              <MenuItem value={12}>12 items</MenuItem>
              <MenuItem value={16}>16 items</MenuItem>
              <MenuItem value={20}>20 items</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {books && books.length > 0 ? (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={6} sm={4} lg={3} key={book.id}>
              <BookItem book={book} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoData />
      )}

      <Pagination
        count={totalPages || 1}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{
          mt: 2,
        }}
      />
    </Paper>
  );
}
