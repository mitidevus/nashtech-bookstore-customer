import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NoData from "components/Common/NoData";
import { DateFormat } from "constants/date";
import { Order } from "constants/sort";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "store";
import { useAddRatingReviewMutation } from "store/api/book/bookApiSlice";
import { selectIsLoggedIn } from "store/slice/userSlice";
import { RatingCount, RatingReview } from "types/rating-review";
import { formatDate } from "utils/date";
import { showSuccess } from "utils/toast";

type FormType = {
  star: number;
  title: string;
  content: string;
};

export default function RatingReviews({
  slug = "",
  avgStars = 0,
  totalReviews = 0,
  ratingCount,
  reviews,
  star,
  totalPages,
  setStar,
  order,
  setOrder,
  take,
  setTake,
  page,
  setPage,
  onReviewSubmit,
}: {
  slug: string;
  avgStars: number;
  totalReviews: number;
  ratingCount: RatingCount;
  reviews: RatingReview[];
  star: number;
  totalPages: number;
  setStar: (star: number) => void;
  order: Order;
  setOrder: (order: Order) => void;
  take: number;
  setTake: (take: number) => void;
  page: number;
  setPage: (page: number) => void;
  onReviewSubmit: () => void;
}) {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [addRatingReview, { isLoading }] = useAddRatingReviewMutation();

  const starRatings = [
    { label: "All", count: totalReviews, value: 0 },
    { label: "5 stars", count: ratingCount.fiveStar, value: 5 },
    { label: "4 stars", count: ratingCount.fourStar, value: 4 },
    { label: "3 stars", count: ratingCount.threeStar, value: 3 },
    { label: "2 stars", count: ratingCount.twoStar, value: 2 },
    { label: "1 star", count: ratingCount.oneStar, value: 1 },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      star: 5,
      title: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    try {
      await addRatingReview({
        slug,
        ...data,
      }).unwrap();

      reset({
        star: 5,
        title: "",
        content: "",
      });

      showSuccess("Submitted review successfully");
      onReviewSubmit();
    } catch (error) {
      // handled error
    }
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom mb={2}>
          Leave a review
        </Typography>

        {isLoggedIn ? (
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="star"
              control={control}
              disabled={isLoading}
              rules={{ required: "Rating is required" }}
              render={({ field }) => (
                <Rating
                  {...field}
                  onChange={(_, newValue) => field.onChange(newValue)}
                />
              )}
            />
            {errors.star && (
              <Typography color="error">{errors.star.message}</Typography>
            )}

            <Controller
              name="title"
              control={control}
              disabled={isLoading}
              rules={{
                required: "Title is required",
                maxLength: {
                  value: 50,
                  message: "Review title should not exceed 50 characters",
                },
                minLength: {
                  value: 5,
                  message: "Review title should be at least 5 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="review-title"
                  label="Title"
                  variant="outlined"
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              disabled={isLoading}
              rules={{
                required: "Review content is required",
                maxLength: {
                  value: 500,
                  message: "Review content should not exceed 500 characters",
                },
                minLength: {
                  value: 10,
                  message: "Review content should be at least 10 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="review-content"
                  label="Your review"
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!errors.content}
                  helperText={errors.content ? errors.content.message : ""}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: "30%",
              }}
            >
              Submit
            </Button>
          </Box>
        ) : (
          <Stack direction="row" justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Login to leave a review
            </Button>
          </Stack>
        )}
      </Paper>

      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom mb={2}>
          Rating & Reviews
        </Typography>

        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
          rowSpacing={2}
        >
          <Grid item xs={12} lg={6}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4" fontWeight={600}>
                {avgStars.toFixed(1)}
              </Typography>

              <Rating name="avgStars" value={avgStars} size="large" readOnly />
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

        <Grid container gap={1} mb={2}>
          {starRatings.map((rating, index) => (
            <Grid item key={index}>
              <Chip
                key={rating.value ?? "all"}
                label={`${rating.label} (${rating.count})`}
                color={star === rating.value ? "primary" : "default"}
                onClick={() => setStar(rating.value)}
              />
            </Grid>
          ))}
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
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
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
                    md={3.5}
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
                      <Typography variant="caption" color="text.secondary">
                        {formatDate({
                          date: review.createdAt,
                          targetFormat: DateFormat.DATE_TIME_2,
                        })}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Rating
                        name="rating"
                        value={review.star}
                        size="small"
                        readOnly
                      />

                      <Typography
                        variant="subtitle2"
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
            count={totalPages || 1}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{
              mt: 2,
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
