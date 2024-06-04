import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import NoData from "components/Common/NoData";
import QuantityInput from "components/Common/QuantityInput";
import { Order } from "constants/sort";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";
import {
  useLazyGetBookDetailQuery,
  useLazyGetRatingReviewsQuery,
} from "store/api/book/bookApiSlice";
import { useAddToCartMutation } from "store/api/cart/cartApiSlice";
import { selectIsLoggedIn } from "store/slice/userSlice";
import { RatingCount, RatingReview } from "types/rating-review";
import { formatCurrency } from "utils/currency";
import { showSuccess } from "utils/toast";
import RatingReviews from "./RatingReviews";

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

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(5);
  const [order, setOrder] = useState<Order>(Order.DESC);
  const [star, setStar] = useState<number>(0);
  const [refreshReviews, setRefreshReviews] = useState(false);

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
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

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
              ...(star && { star }),
            }).unwrap();

          setReviewData({
            data,
            totalCount,
            totalPages,
            ratingCount,
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
  }, [
    getBookDetail,
    getRatingReview,
    navigate,
    order,
    page,
    slug,
    star,
    take,
    refreshReviews,
  ]);

  const customRoutes = [
    {
      path: `/shop/book`,
      breadcrumb: null,
    },
    {
      path: `/shop/book/${slug}`,
      breadcrumb: book?.name,
    },
  ];

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      if (book?.id) {
        await addToCart({ bookId: book.id, quantity }).unwrap();
        showSuccess(`Added ${book.name} to cart`, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || isLoadingReview) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs customRoutes={customRoutes} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
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
            onClick={(author) => navigate(`/shop/author/${author.slug}`)}
          />

          <ChipList
            title="Categories"
            items={book?.categories || []}
            onClick={(category) => navigate(`/shop/category/${category.slug}`)}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
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
                  <>
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
                        precision={0.5}
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

                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 400,
                      }}
                    >
                      |
                    </Typography>
                  </>
                )}

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
                  {book && formatCurrency(book.finalPrice * 1000)}
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
                  disabled={isAddingToCart}
                  onClick={handleAddToCart}
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

          <RatingReviews
            slug={slug || ""}
            avgStars={book?.avgStars || 0}
            totalReviews={book?.totalReviews || 0}
            ratingCount={reviewData.ratingCount}
            reviews={reviewData.data}
            totalPages={reviewData.totalPages}
            page={page}
            setPage={setPage}
            take={take}
            setTake={setTake}
            order={order}
            setOrder={setOrder}
            star={star || 0}
            setStar={setStar}
            onReviewSubmit={() => setRefreshReviews(!refreshReviews)}
          />
        </Grid>
      </Grid>
    </>
  );
}
