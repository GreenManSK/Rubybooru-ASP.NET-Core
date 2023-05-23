import { Pagination as MuiPagination, Button, Box } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";

const paginationStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const shuffleButtonStyles = {
  minWidth: 0,
};

const paginationStatsStyles = {
  textAlign: "center",
  fontSize: "1.2rem",
};
export interface IPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  items: number;
}

export const Pagination = (props: IPaginationProps) => {
  const { page, pageCount, onPageChange, items } = props;

  const setRandomPage = () => {
    const randomPage = Math.floor(Math.random() * (pageCount - 1) + 1);
    if (randomPage === page) {
      setRandomPage();
    }
    onPageChange(randomPage);
  };

  return (
    <>
      <Box sx={paginationStyles}>
        <MuiPagination
          count={pageCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          shape="rounded"
          color="primary"
          variant="outlined"
        />
        {pageCount > 1 && (
          <Button
            variant="outlined"
            size="small"
            sx={shuffleButtonStyles}
            onClick={setRandomPage}
          >
            <ShuffleIcon />
          </Button>
        )}
      </Box>
      {items !== undefined ? (
        <Box sx={paginationStatsStyles}>({items} images)</Box>
      ) : null}
    </>
  );
};
