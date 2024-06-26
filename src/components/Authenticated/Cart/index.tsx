import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyCart from "assets/images/empty-cart.png";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import QuantityInput from "components/Common/QuantityInput";
import {
  useClearCartMutation,
  useLazyGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemsMutation,
} from "store/api/cart/cartApiSlice";
import { Cart as CartType } from "types/cart";
import { formatCurrency } from "utils/currency";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartType>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    finalPrice: 0,
    discount: 0,
  });

  const [getCart, { isLoading }] = useLazyGetCartQuery();
  const [updateCartItems] = useUpdateCartItemsMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  useEffect(() => {
    (async () => {
      try {
        const res = await getCart().unwrap();

        setCart(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [getCart]);

  const handleUpdateQuantity = async (bookId: number, quantity: number) => {
    try {
      const res = await updateCartItems({ bookId, quantity }).unwrap();

      setCart(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (bookId: number) => {
    try {
      const res = await removeCartItem(bookId).unwrap();

      setCart(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await clearCart().unwrap();

      setCart(res);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <Box minWidth={670}>
      <Breadcrumbs />

      {cart && cart.items.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8.5}>
            <Paper elevation={1} sx={{ py: 2, borderRadius: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  px: 2,
                  mb: 2,

                  "& span": {
                    color: "text.secondary",
                    fontWeight: 400,
                  },
                }}
              >
                Cart
                <span> ({cart.totalQuantity} items)</span>
              </Typography>

              <Table sx={{ minWidth: 650 }} aria-label="cart-items">
                <TableHead
                  sx={{
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.bookId}>
                      <TableCell width="40%">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            "&:hover": {
                              cursor: "pointer",
                              color: "primary.main",
                            },
                          }}
                          onClick={() =>
                            navigate(`/shop/book/${item.book.slug}`)
                          }
                        >
                          <img
                            src={item.book.image}
                            alt={item.book.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                            }}
                          >
                            {item.book.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(item.book.finalPrice * 1000)}
                        </Typography>

                        {item.book.promotionList && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "#D0D5DD",
                              textDecoration: "line-through",
                              fontWeight: "normal",
                            }}
                          >
                            {formatCurrency(item.book.price * 1000)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                        }}
                      >
                        <QuantityInput
                          quantity={item.quantity}
                          setQuantity={(quantity) =>
                            handleUpdateQuantity(item.bookId, quantity)
                          }
                          width="1.7rem"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "25%",
                          fontWeight: 600,
                          color: "error.main",
                        }}
                      >
                        {formatCurrency(item.totalPrice * 1000)}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "5%",
                        }}
                      >
                        <IconButton
                          size="medium"
                          onClick={() => handleRemoveItem(item.bookId)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    mt: 2,
                  }}
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    mt: 2,
                  }}
                  disabled={cart.totalQuantity === 0}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={3.5}>
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  px: 2,
                  py: 2,
                }}
              >
                Order Summary
              </Typography>

              <Divider />

              <Stack direction="column" spacing={1} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">
                    {formatCurrency(cart.totalPrice * 1000)}
                  </Typography>
                </Box>

                {cart.discount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2">
                      -{formatCurrency(cart.discount * 1000)}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Total Payment
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(cart.finalPrice * 1000)}
                </Typography>
              </Box>
            </Paper>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{
                mt: 2,
              }}
              onClick={() => navigate("/cart/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            py: 4,
          }}
        >
          <Box
            component="img"
            src={EmptyCart}
            alt="empty-cart"
            sx={{ width: 160, height: 160 }}
          />

          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="body2">
            Looks like you haven't added any items to your cart yet
          </Typography>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/shop")}
            >
              Go to shop
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
