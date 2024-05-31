import { Box, Button, Rating, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Book } from "types/book";
import { formatCurrency } from "utils/currency";

export default function BookItem({ book }: { book: Book }) {
  const navigate = useNavigate();
  return (
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
      <Box
        component="img"
        src={book.image}
        alt={book.name}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          objectPosition: "center",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/books/${book.slug}`)}
      />

      {book.promotionList && (
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
            cursor: "pointer",
          }}
          onClick={() => navigate(`/books/${book.slug}`)}
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
              book.promotionList ? book.finalPrice * 1000 : book.price * 1000
            )}
          </Typography>

          {book.promotionList && (
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
            // gap: 1,
          }}
        >
          <Rating name="avgStars" value={book.avgStars} size="small" readOnly />

          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              //   fontWeight: "normal",
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
  );
}
