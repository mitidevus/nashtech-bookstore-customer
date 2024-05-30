import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CenterLoading from "components/Common/CenterLoading";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useGetAuthorsQuery } from "store/api/author/authorApiSlice";
import { useGetCategoriesQuery } from "store/api/category/categoryApiSlice";
import { Author } from "types/author";
import { Category } from "types/category";
import { ScrollbarStyle } from "utils/style";

function SearchableAccordion({
  title,
  items,
  linkPrefix,
}: {
  title: string;
  items: Author[] | Category[];
  linkPrefix: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>

      <Divider />

      <AccordionDetails
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          ...ScrollbarStyle,
        }}
      >
        {items && items.length > 0 ? (
          <>
            <TextField
              fullWidth
              size="small"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ my: 2 }}
            />

            <Grid container direction="column">
              {filteredItems.map((item) => (
                <Typography
                  key={item.slug}
                  component={Link}
                  to={`${linkPrefix}/${item.slug}`}
                  variant="subtitle2"
                  sx={{
                    py: 1,
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {item.name}
                </Typography>
              ))}
            </Grid>
          </>
        ) : (
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            No {title.toLowerCase()}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function ShopLayout() {
  const { data: authors, isLoading: fetchingAuthor } = useGetAuthorsQuery();
  const { data: categories, isLoading: fetchingCategory } =
    useGetCategoriesQuery();

  if (fetchingAuthor || fetchingCategory) {
    return <CenterLoading />;
  }

  return (
    <Grid container mt={4} spacing={2}>
      <Grid item xs={12} md={3}>
        <SearchableAccordion
          title="Author"
          items={authors as Author[]}
          linkPrefix="/shop/author"
        />

        <SearchableAccordion
          title="Category"
          items={categories as Category[]}
          linkPrefix="/shop/category"
        />

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-content"
            id="panel-header"
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
              }}
            >
              Rating Review
            </Typography>
          </AccordionSummary>

          <Divider />

          <AccordionDetails>
            <Grid container direction="column">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Typography
                  key={rating}
                  component={Link}
                  to={`/shop/rating/${rating}`}
                  variant="subtitle2"
                  sx={{
                    py: 1,
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {`${rating} ${rating === 1 ? "star" : "stars"}`}
                </Typography>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12} md={9}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
