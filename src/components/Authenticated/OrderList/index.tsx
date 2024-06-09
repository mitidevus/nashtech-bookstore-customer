import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
import { DateFormat } from "constants/date";
import { OrderStatusChip } from "constants/order";
import { Order } from "constants/sort";
import { useLazyGetOrdersQuery } from "store/api/order/orderApiSlice";
import { formatCurrency } from "utils/currency";
import { formatDate } from "utils/date";

export default function OrderList() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(5);
  const [order, setOrder] = useState<Order>(Order.DESC);

  const [getOrders, { isLoading, data }] = useLazyGetOrdersQuery();

  useEffect(() => {
    (async () => {
      try {
        await getOrders({
          page,
          take,
          order,
        }).unwrap();
      } catch (error) {
        console.error(error);
        navigate("/cart");
        return;
      }
    })();
  }, [getOrders, navigate, order, page, take]);

  const customRoutes = [
    {
      path: "/order",
      breadcrumb: "Order history",
    },
  ];

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <Box minWidth={750}>
      <Breadcrumbs customRoutes={customRoutes} />

      {data && data.data.length > 0 ? (
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,

                "& span": {
                  color: "text.secondary",
                  fontWeight: 400,
                },
              }}
            >
              Orders
              <span> ({data?.totalCount})</span>
            </Typography>

            <Stack direction="row" spacing={2}>
              <FormControl sx={{ minWidth: 100, ml: 2 }}>
                <InputLabel id="sort-by">Sort by</InputLabel>
                <Select
                  labelId="sort-by"
                  id="sort-by"
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value as Order);
                    setPage(1);
                  }}
                  label="Sort by"
                  size="small"
                >
                  <MenuItem value={Order.DESC}>Newest</MenuItem>
                  <MenuItem value={Order.ASC}>Oldest</MenuItem>
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
                  <MenuItem value={5}>5 items</MenuItem>
                  <MenuItem value={10}>10 items</MenuItem>
                  <MenuItem value={15}>15 items</MenuItem>
                  <MenuItem value={20}>20 items</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Table aria-label="order-items">
            <TableHead
              sx={{
                backgroundColor: "#F3F4F6",
              }}
            >
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Purchased At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => navigate(`/order/${item.id}`)}
                  sx={{
                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                    },
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {formatCurrency(item.totalPrice * 1000)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{ width: "fit-content" }}
                      component="span"
                      variant="filled"
                      color={OrderStatusChip[item.status].color}
                      size="small"
                      label={OrderStatusChip[item.status].label}
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate({
                      date: item.createdAt,
                      targetFormat: DateFormat.TIME_DATE,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            count={data?.totalPages || 1}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
            }}
          />
        </Paper>
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
            alt="no-order"
            sx={{ width: 160, height: 160 }}
          />

          <Typography variant="h6">
            You haven't placed any orders yet
          </Typography>
          <Typography variant="body2">
            Go to the shop and find something you like
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
