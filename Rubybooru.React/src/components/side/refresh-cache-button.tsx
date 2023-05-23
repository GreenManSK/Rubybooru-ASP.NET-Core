import { Link } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

export const RefreshCacheButton = () => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    localStorage.setItem("cache-buster", new Date().toString());
    window.location.reload();
  };

  return (
    <Link title="Refresh cache" href="#" onClick={onClick}>
      Refresh cache
    </Link>
  );
};
