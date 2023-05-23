import { Link } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

export const RefreshCacheButton = () => {
  const queryClient = useQueryClient();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    queryClient.resetQueries();
    window.location.reload();
  };

  return (
    <Link title="Refresh cache" href="#" onClick={onClick}>
      Refresh cache
    </Link>
  );
};
