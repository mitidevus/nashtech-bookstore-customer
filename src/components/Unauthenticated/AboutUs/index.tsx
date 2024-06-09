import { Box, Paper } from "@mui/material";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import CenterLoading from "components/Common/CenterLoading";
import NoData from "components/Common/NoData";
import { useGetAboutQuery } from "store/api/about/aboutApiSlice";

export default function AboutUs() {
  const { data, isLoading } = useGetAboutQuery();

  if (isLoading) {
    return <CenterLoading />;
  }

  return (
    <>
      <Breadcrumbs />

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {data ? (
          <Box dangerouslySetInnerHTML={{ __html: data }} />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <NoData message="Something went wrong! Cannot get about us content" />
          </Box>
        )}
      </Paper>
    </>
  );
}
