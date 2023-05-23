import { Link } from "@mui/material";
import { useHttpClient } from "../../providers/http-client-provider";
import { useNavigate } from "react-router-dom";
import { randomImageUrl } from "../../queries/image-urls";

export const RandomButton = () => {
  const client = useHttpClient();
  const navigate = useNavigate();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    client.get<number>(randomImageUrl).then((id) => navigate(`/image/${id}`));
  };

  return (
    <Link title="Random image" href="#" onClick={onClick}>
      Random image
    </Link>
  );
};
