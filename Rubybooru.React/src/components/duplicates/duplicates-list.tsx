import { useNavigate, useSearchParams } from "react-router-dom";
import { useDuplicatesOptions } from "../../utils/images";
import { useDuplicates, useDuplicatesCount } from "../../queries/duplicates";
import Stack from "@mui/material/Stack";
import { Pagination } from "../image-list/pagination";
import Grid from "@mui/material/Grid";
import React, { PropsWithChildren } from "react";
import { DuplicateItem, ImageSkeleton } from "./duplicate-item";

const containerId = "duplicates-container";

const gridStyles = {
  textAlign: "center",
  justifyContent: "center",
  flexDirection: "column",
  display: "flex",
};

const GridItem: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid xl={2} lg={3} sm={4} xs={12} sx={gridStyles}>
    {children}
  </Grid>
);

const DuplicatesList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateOptions = useDuplicatesOptions();
  const { page, imagesPerPage } = duplicateOptions;

  const { data: duplicates } = useDuplicates(duplicateOptions);
  const { data: duplicatesCount = 0 } = useDuplicatesCount();
  const pageCount = Math.ceil(duplicatesCount / imagesPerPage);

  const navigateToPage = (page: number) => {
    navigate({
      pathname: `/duplicates/${page}`,
      search: searchParams.toString(),
    });
    document.getElementById(containerId)?.scrollIntoView();
  };

  // TODO: Skeleton

  return (
    <Stack spacing={2}>
      <Grid id={containerId} container spacing={2}>
        {duplicates
          ? duplicates.map((duplicate) => (
              <GridItem key={duplicate.id}>
                <DuplicateItem duplicateRecord={duplicate} />
              </GridItem>
            ))
          : [...new Array(imagesPerPage)].map((_, i) => (
              <GridItem key={i}>
                <ImageSkeleton />
                <ImageSkeleton />
              </GridItem>
            ))}
      </Grid>
      <Pagination
        items={duplicatesCount}
        page={page}
        pageCount={pageCount}
        onPageChange={navigateToPage}
      />
    </Stack>
  );
};

export default DuplicatesList;
