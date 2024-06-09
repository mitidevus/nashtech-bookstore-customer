import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import { DateFormat } from "constants/date";
import {
  OrderStatus,
  OrderStatusChip,
  PaymentMethodOptions,
} from "constants/order";
import { useConfirm } from "material-ui-confirm";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCancelOrderMutation,
  useLazyGetOrderQuery,
} from "store/api/order/orderApiSlice";
import { formatCurrency } from "utils/currency";
import { formatDate } from "utils/date";
import { showSuccess } from "utils/toast";

export default function OrderDetail() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { id: orderId } = useParams();

  const [getOrder, { isLoading, data: order }] = useLazyGetOrderQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  useEffect(() => {
    if (!orderId) {
      navigate("/order");
      return;
    }
    (async () => {
      try {
        await getOrder(orderId).unwrap();
      } catch (error) {
        console.error(error);
        navigate("/cart");
        return;
      }
    })();
  }, [getOrder, navigate, orderId]);

  const handleCancelOrder = async () => {
    try {
      await confirm({
        title: "Cancel order",
        description: "Are you sure you want to cancel this order?",
        confirmationText: "Yes",
        cancellationText: "No",
      });

      await cancelOrder(orderId!).unwrap();
      await getOrder(orderId!).unwrap();
      showSuccess("Cancelled order successfully");
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const customRoutes = [
    {
      path: "/order",
      breadcrumb: "Order history",
    },
    {
      path: `/order/:id`,
      breadcrumb: "Order details",
    },
  ];

  if (isLoading || isCancelling) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs customRoutes={customRoutes} />

      <Box
        sx={{
          minWidth: 750,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 500,
                  p: 2,
                }}
              >
                Order details
                <Chip
                  sx={{ width: "fit-content" }}
                  component="span"
                  variant="filled"
                  color={order && OrderStatusChip[order.status].color}
                  size="small"
                  label={order && OrderStatusChip[order.status].label}
                />
              </Typography>

              <Divider />

              <Stack direction="column" spacing={1} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Order ID</Typography>
                  <Typography variant="body2">{order?.id}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Payment method</Typography>
                  <Typography variant="body2">
                    {order && PaymentMethodOptions[order?.paymentMethod]}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Purchases at</Typography>
                  <Typography variant="body2">
                    {formatDate({
                      date: order?.createdAt || "",
                      targetFormat: DateFormat.TIME_DATE,
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Updated at</Typography>
                  <Typography variant="body2">
                    {formatDate({
                      date: order?.updatedAt || "",
                      targetFormat: DateFormat.TIME_DATE,
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
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
                  p: 2,
                }}
              >
                Customer
              </Typography>

              <Divider />

              <Stack direction="column" spacing={1} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Full name</Typography>
                  <Typography variant="body2">{order?.fullName}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Email</Typography>
                  <Typography variant="body2">{order?.user.email}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Phone</Typography>
                  <Typography variant="body2">{order?.phone}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Shipping address</Typography>
                  <Typography variant="body2">
                    {order?.shippingAddress}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

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
              p: 2,
            }}
          >
            Items
          </Typography>

          <Table sx={{ minWidth: 650 }} aria-label="order-items">
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
              </TableRow>
            </TableHead>
            <TableBody>
              {order &&
                order.items.length > 0 &&
                order?.items.map((item) => (
                  <TableRow key={item.book.id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": {
                            cursor: "pointer",
                            color: "primary.main",
                          },
                        }}
                        onClick={() => navigate(`/shop/book/${item.book.slug}`)}
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
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(item.finalPrice * 1000)}
                      </Typography>

                      {item.finalPrice < item.price && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#D0D5DD",
                            textDecoration: "line-through",
                            fontWeight: "normal",
                          }}
                        >
                          {formatCurrency(item.price * 1000)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "error.main",
                      }}
                    >
                      {formatCurrency(item.totalPrice * 1000)}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    Total:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color="error.main">
                    {order ? formatCurrency(order?.totalPrice * 1000) : "0"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Button variant="outlined" onClick={() => navigate("/order")}>
              Back to order history
            </Button>
            {order?.status === OrderStatus.PENDING ? (
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelOrder}
              >
                Cancel order
              </Button>
            ) : (
              <Button variant="contained" onClick={() => navigate(`/shop`)}>
                Continue shopping
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
}
