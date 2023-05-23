import { Link } from "@mui/material";
import { useHttpClient } from "../../providers/http-client-provider";
import { getImageUrl } from "../../queries/images";
import { useNavigate } from "react-router-dom";

export const RandomButton = () => {
  const client = useHttpClient();
  const navigate = useNavigate();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    client
      .get<number>(`${getImageUrl()}random`)
      .then((id) => navigate(`/image/${id}`));
  };

  return (
    <Link title="Random image" href="#" onClick={onClick}>
      Random image
    </Link>
  );
};
