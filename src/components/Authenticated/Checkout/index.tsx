import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import COD from "assets/images/cod.png";
import Momo from "assets/images/momo.webp";
import VNPay from "assets/images/vnpay.webp";
import ZaloPay from "assets/images/zalopay.webp";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import { PaymentMethod } from "constants/order";
import { useAppSelector } from "store";
import {
  useCheckoutMutation,
  useLazyGetCartQuery,
} from "store/api/cart/cartApiSlice";
import { selectUserInfo } from "store/slice/userSlice";
import { Cart, CheckoutDto } from "types/cart";
import { formatCurrency } from "utils/currency";
import { showSuccess } from "utils/toast";

export default function Checkout() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUserInfo);

  const [cart, setCart] = useState<Cart>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    finalPrice: 0,
    discount: 0,
  });

  const [getCart, { isLoading }] = useLazyGetCartQuery();
  const [requestCheckout, { isLoading: isCreatingOrder }] =
    useCheckoutMutation();

  useEffect(() => {
    (async () => {
      try {
        const res = await getCart().unwrap();

        if (res.totalQuantity === 0) {
          navigate("/cart");
          return;
        } else {
          setCart(res);
        }
      } catch (error) {
        console.error(error);
        navigate("/cart");
        return;
      }
    })();
  }, [getCart, navigate]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutDto>({
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      shippingAddress: user?.address || "",
      paymentMethod: PaymentMethod.COD,
    },
  });

  const onSubmit: SubmitHandler<CheckoutDto> = async (data) => {
    try {
      const res = await requestCheckout(data).unwrap();

      showSuccess("Thank you for ordering!");

      navigate(`/order/${res.id}`);
      return;
    } catch (error) {
      // handled error
    }
  };

  if (isLoading || isCreatingOrder) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs />

      {cart && cart.items.length > 0 && (
        <Grid
          container
          spacing={2}
          direction={{ xs: "column-reverse", md: "row" }}
        >
          <Grid item xs={12} md={6.5}>
            <Paper elevation={1}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  p: 2,
                }}
              >
                Payment Information
              </Typography>

              <Divider />

              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 4,
                }}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="fullName"
                  control={control}
                  disabled={isLoading}
                  rules={{
                    required: "Full name is required",
                    maxLength: {
                      value: 20,
                      message: "Full name should not exceed 20 characters",
                    },
                    minLength: {
                      value: 3,
                      message: "Full name should be at least 3 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="fullName"
                      label="Full Name"
                      variant="outlined"
                      size="small"
                      error={!!errors.fullName}
                      helperText={
                        errors.fullName ? errors.fullName.message : ""
                      }
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  disabled={isLoading}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      variant="outlined"
                      size="small"
                      error={!!errors.phone}
                      helperText={errors.phone ? errors.phone.message : ""}
                    />
                  )}
                />

                <Controller
                  name="shippingAddress"
                  control={control}
                  disabled={isLoading}
                  rules={{
                    required: "Shipping address is required",
                    maxLength: {
                      value: 100,
                      message:
                        "Shipping address should not exceed 100 characters",
                    },
                    minLength: {
                      value: 10,
                      message:
                        "Shipping address should be at least 10 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="shippingAddress"
                      label="Shipping Address"
                      variant="outlined"
                      size="small"
                      error={!!errors.shippingAddress}
                      helperText={
                        errors.shippingAddress
                          ? errors.shippingAddress.message
                          : ""
                      }
                    />
                  )}
                />

                <Controller
                  name="paymentMethod"
                  control={control}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel
                        id="payment-method-label"
                        sx={{
                          fontSize: "0.8rem",
                        }}
                      >
                        Payment Method
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="payment-method-label"
                        defaultValue={PaymentMethod.COD}
                        {...field}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <FormControlLabel
                          value={PaymentMethod.COD}
                          control={<Radio size="small" />}
                          label={
                            <Stack direction="row" alignItems="center" gap={2}>
                              <img
                                src={COD}
                                alt="COD"
                                style={{ width: 28, height: 28 }}
                              />
                              <Typography variant="body2">
                                Cash on Delivery
                              </Typography>
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value={PaymentMethod.MOMO}
                          control={<Radio size="small" />}
                          label={
                            <Stack direction="row" alignItems="center" gap={2}>
                              <img
                                src={Momo}
                                alt="Momo"
                                style={{ width: 28, height: 28 }}
                              />
                              <Typography variant="body2">
                                Pay with MoMo
                              </Typography>
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value={PaymentMethod.ZALO_PAY}
                          control={<Radio size="small" />}
                          label={
                            <Stack direction="row" alignItems="center" gap={2}>
                              <img
                                src={ZaloPay}
                                alt="ZaloPay"
                                style={{ width: 28, height: 28 }}
                              />
                              <Typography variant="body2">
                                Pay with ZaloPay
                              </Typography>
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value={PaymentMethod.VN_PAY}
                          control={<Radio size="small" />}
                          label={
                            <Stack direction="row" alignItems="center" gap={2}>
                              <img
                                src={VNPay}
                                alt="VNPay"
                                style={{ width: 28, height: 28 }}
                              />
                              <Typography variant="body2">
                                Pay with VNPAY
                              </Typography>
                            </Stack>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      mt: 2,
                    }}
                    onClick={() => navigate("/cart")}
                  >
                    Back to Cart
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    color="error"
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Place Order
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5.5}>
            <Paper elevation={1}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  p: 2,

                  "& span": {
                    color: "text.secondary",
                    fontWeight: 400,
                  },
                }}
              >
                Order Details
                <span> ({cart.totalQuantity} items)</span>
              </Typography>

              <Divider />

              {cart &&
                cart.items.length > 0 &&
                cart.items.map((item) => (
                  <Box
                    key={item.bookId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <img
                        src={item.book.image}
                        alt={item.book.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                        }}
                      />

                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.book.name}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Typography variant="body2">
                            {`${item.quantity} x ${formatCurrency(
                              item.book.finalPrice * 1000
                            )}`}
                          </Typography>

                          {item.book.promotionList && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#D0D5DD",
                                textDecoration: "line-through",
                              }}
                            >
                              {formatCurrency(item.book.price * 1000)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" fontWeight={500}>
                      {formatCurrency(item.totalPrice * 1000)}
                    </Typography>
                  </Box>
                ))}

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
                <Typography variant="h6">Total Payment</Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(cart.finalPrice * 1000)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}
