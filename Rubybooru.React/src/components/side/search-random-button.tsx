import { Link } from "@mui/material";
import { useHttpClient } from "../../providers/http-client-provider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { randomSearchImageUrl } from "../../queries/image-urls";
import { useImageSearchParams } from "../../utils/navigation-helpers";

export const SearchRandomButton = () => {
  const [{ tags, sizeConditions }] = useImageSearchParams();
  const [searchParams] = useSearchParams();

  const client = useHttpClient();
  const navigate = useNavigate();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    client
      .get<number>(
        randomSearchImageUrl(
          tags.map((t) => t.id),
          sizeConditions
        )
      )
      .then((id) => {
        navigate({
          pathname: `/image/${id}`,
          search: searchParams.toString(),
        });
      });
  };

  if (tags.length > 0 || sizeConditions.length > 0) {
    return (
      <Link title="Random image from current search" href="#" onClick={onClick}>
        Random image from current search
      </Link>
    );
  }
  return <></>;
};
