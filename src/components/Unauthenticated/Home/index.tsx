import GradeIcon from "@mui/icons-material/Grade";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import BookItem from "components/Common/BookItem";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import NoData from "components/Common/NoData";
import { SpecialBook } from "constants/book";
import { Link } from "react-router-dom";
import { useLazyGetSpecialBooksQuery } from "store/api/book/bookApiSlice";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Book } from "types/book";

export default function Home() {
  const [data, setData] = useState<{
    onSale: Book[];
    recommended: Book[];
    popular: Book[];
  }>({ onSale: [], recommended: [], popular: [] });

  const [tabValue, setTabValue] = useState("1");

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [getSpecialBooks, { isLoading }] = useLazyGetSpecialBooksQuery();

  useEffect(() => {
    (async () => {
      try {
        const response = await Promise.all([
          getSpecialBooks({
            page: 1,
            take: 20,
            type: SpecialBook.ON_SALE,
          }).unwrap(),
          getSpecialBooks({
            page: 1,
            take: 8,
            type: SpecialBook.RECOMMENDED,
          }).unwrap(),
          getSpecialBooks({
            page: 1,
            take: 8,
            type: SpecialBook.POPULAR,
          }).unwrap(),
        ]);

        setData({
          onSale: response[0],
          recommended: response[1],
          popular: response[2],
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [getSpecialBooks]);

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <Box minWidth={600}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs />

        <Typography
          component={Link}
          to="/shop"
          color="primary"
          fontWeight={500}
        >
          View all
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
            }}
            color="error"
          >
            <LocalActivityIcon />
            On Sale
          </Typography>

          {data && data.onSale.length > 0 ? (
            <Box sx={{ px: 2 }}>
              <Swiper
                modules={[Autoplay, FreeMode]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                spaceBetween={16}
                slidesPerView={4}
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                  },
                  900: {
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                }}
                style={{
                  padding: "4px 0",
                }}
              >
                {data.onSale.map((book) => (
                  <SwiperSlide key={book.id}>
                    <BookItem book={book} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          ) : (
            <NoData />
          )}
        </Paper>

        <Paper elevation={1} sx={{ py: 2, borderRadius: 2 }}>
          <TabContext value={tabValue}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  fontWeight: 500,
                }}
                color="warning.main"
              >
                Featured Books
              </Typography>

              <TabList aria-label="tabs" onChange={handleChangeTab}>
                <Tab label="Recommended" value="1" />
                <Tab label="Popular" value="2" />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={{
                py: 0,
                px: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                  }}
                  color="success.main"
                >
                  <GradeIcon />
                  Recommended
                </Typography>

                {data && data.recommended.length > 0 ? (
                  <Grid container spacing={2} px={2} py={1}>
                    {data.recommended.map((book) => (
                      <Grid item xs={6} md={4} lg={3} key={book.id}>
                        <BookItem book={book} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <NoData />
                )}
              </Box>
            </TabPanel>
            <TabPanel
              value="2"
              sx={{
                py: 0,
                px: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                  }}
                  color="primary"
                >
                  <ThumbUpIcon />
                  Popular
                </Typography>

                {data && data.popular.length > 0 ? (
                  <Grid container spacing={2} px={2} py={1}>
                    {data.popular.map((book) => (
                      <Grid item xs={6} md={4} lg={3} key={book.id}>
                        <BookItem book={book} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <NoData />
                )}
              </Box>
            </TabPanel>
          </TabContext>
        </Paper>
      </Box>
    </Box>
  );
}
