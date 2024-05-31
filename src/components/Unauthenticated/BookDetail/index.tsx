import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Rating,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import CenterLoading from "components/Common/CenterLoading";
import NoData from "components/Common/NoData";
import QuantityInput from "components/Common/QuantityInput";
import { DateFormat } from "constants/date";
import { Order } from "constants/sort";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLazyGetBookDetailQuery,
  useLazyGetRatingReviewsQuery,
} from "store/api/book/bookApiSlice";
import { RatingCount, RatingReview } from "types/rating-review";
import { formatCurrency } from "utils/currency";
import { formatDate } from "utils/date";

const ChipList = ({
  title,
  items,
  onClick,
}: {
  title: string;
  items: any[];
  onClick: (item: any) => void;
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        mt: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={1}>
        {items && items.length > 0 ? (
          items.map((item) => (
            <Grid item key={item.id}>
              <Chip
                label={item.name}
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => onClick(item)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <NoData message="No authors available" />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default function BookDetail() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(5);
  const [order, setOrder] = useState<Order>(Order.DESC);
  const [star, setStar] = useState<number | undefined>(undefined);

  const [reviewData, setReviewData] = useState<{
    data: RatingReview[];
    totalPages: number;
    totalCount: number;
    ratingCount: RatingCount;
  }>({
    data: [],
    totalPages: 1,
    totalCount: 0,
    ratingCount: {
      oneStar: 0,
      twoStar: 0,
      threeStar: 0,
      fourStar: 0,
      fiveStar: 0,
    },
  });

  const [getBookDetail, { isLoading, data: book }] =
    useLazyGetBookDetailQuery();
  const [getRatingReview, { isLoading: isLoadingReview }] =
    useLazyGetRatingReviewsQuery();

  useEffect(() => {
    (async () => {
      if (slug) {
        try {
          await getBookDetail(slug).unwrap();
          const { data, totalCount, totalPages, ratingCount } =
            await getRatingReview({
              slug,
              page,
              take,
              order,
              star,
            }).unwrap();

          setReviewData({
            data,
            totalCount,
            totalPages,
            ratingCount,
          });
        } catch (error) {
          navigate("/shop");
        }
      } else {
        navigate("/shop");
      }
    })();
  }, [getBookDetail, getRatingReview, navigate, order, page, slug, star, take]);

  const starRatings = [
    { label: "All", count: book?.totalReviews, value: undefined },
    { label: "5 stars", count: reviewData.ratingCount.fiveStar, value: 5 },
    { label: "4 stars", count: reviewData.ratingCount.fourStar, value: 4 },
    { label: "3 stars", count: reviewData.ratingCount.threeStar, value: 3 },
    { label: "2 stars", count: reviewData.ratingCount.twoStar, value: 2 },
    { label: "1 star", count: reviewData.ratingCount.oneStar, value: 1 },
  ];

  if (isLoading || isLoadingReview) {
    return <CenterLoading />;
  }

  return (
    <Box>
      <Grid container mt={0} spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={book?.image}
              alt={book?.name}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            />
          </Paper>

          <ChipList
            title="Authors"
            items={book?.authors || []}
            onClick={(author) => navigate(`/authors/${author.id}`)}
          />

          <ChipList
            title="Categories"
            items={book?.categories || []}
            onClick={(category) => navigate(`/categories/${category.id}`)}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                }}
              >
                {book?.name}
              </Typography>

              <Stack direction="row" spacing={1}>
                {book?.avgStars !== 0 && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.primary",
                      }}
                    >
                      {book?.avgStars.toFixed(1)}
                    </Typography>

                    <Rating
                      name="avgStars"
                      value={book?.avgStars}
                      size="small"
                      readOnly
                    />

                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      ({book?.totalReviews})
                    </Typography>
                  </Stack>
                )}

                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                  }}
                >
                  |
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                  }}
                >
                  {book?.soldQuantity} sold
                </Typography>
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "error.main",
                    fontWeight: "bold",
                  }}
                >
                  {book &&
                    formatCurrency(
                      book?.promotionList
                        ? book.finalPrice * 1000
                        : book.price * 1000
                    )}
                </Typography>

                {book?.promotionList && (
                  <Chip
                    label={`-${book.discountPercentage}%`}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>

              {book?.promotionList && (
                <Typography
                  variant="subtitle1"
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

            <Divider />

            <Stack
              direction="column"
              spacing={4}
              sx={{
                p: 2,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  Quantity
                </Typography>

                <QuantityInput quantity={quantity} setQuantity={setQuantity} />

                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={() => navigate(`/cart`)}
                >
                  Add to cart
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  color="error"
                  onClick={() => navigate(`/checkout/${book?.id}`)}
                >
                  Buy now
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">{book?.description}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom mb={2}>
          Rating & Reviews
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Typography variant="h4" fontWeight={600}>
            {book?.avgStars.toFixed(1)}
          </Typography>

          <Rating
            name="avgStars"
            value={book?.avgStars}
            size="large"
            readOnly
          />
        </Stack>

        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
          rowSpacing={4}
        >
          <Grid item xs={12} lg={6}>
            <Stack direction="row" gap={1}>
              {starRatings.map((rating) => (
                <Chip
                  key={rating.value ?? "all"}
                  label={`${rating.label} (${rating.count})`}
                  color={star === rating.value ? "primary" : "default"}
                  onClick={() => setStar(rating.value)}
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Stack
              direction="row"
              justifyContent={{
                xs: "flex-start",
                lg: "flex-end",
              }}
              gap={2}
            >
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel id="sort-by">Sort by</InputLabel>
                <Select
                  labelId="sort-by"
                  id="sort-by"
                  value={order}
                  onChange={(e) => setOrder(e.target.value as Order)}
                  label="Sort by"
                  size="small"
                >
                  <MenuItem value={Order.DESC}>
                    Sort by date: Newest to oldest
                  </MenuItem>
                  <MenuItem value={Order.ASC}>
                    Sort by date: Oldest to newest
                  </MenuItem>
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
                  <MenuItem value={3}>3 items</MenuItem>
                  <MenuItem value={5}>5 items</MenuItem>
                  <MenuItem value={7}>7 items</MenuItem>
                  <MenuItem value={10}>10 items</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {reviewData && reviewData.data.length > 0 ? (
            reviewData.data.map((review) => (
              <Paper
                key={review.id}
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                <Grid
                  container
                  rowSpacing={{
                    xs: 2,
                    md: 0,
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={review.user.image}
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2">
                        {review.user.name}
                      </Typography>
                      <Typography variant="caption">
                        {formatDate({
                          date: review.createdAt,
                          targetFormat: DateFormat.DATE,
                        })}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Rating
                        name="rating"
                        value={review.star}
                        size="medium"
                        readOnly
                      />

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {review.title}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" mt={1}>
                      {review.content}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Box sx={{ width: "100%", p: 2 }}>
              <NoData message="No reviews available" />
            </Box>
          )}

          <Pagination
            count={reviewData.totalPages || 1}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{
              mt: 2,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
