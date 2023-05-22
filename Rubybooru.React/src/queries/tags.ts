import { ITag } from "./../entities/tag";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { getImageUrl } from "./images";

export const useTags = (
  ids: number[],
  options: UseQueryOptions<{ [key: string]: ITag[] }> = {}
) => {
  const client = useHttpClient();

  return useQuery<{ [key: string]: ITag[] }>({
    queryKey: ["tags", ...ids],
    queryFn: () => client.get<{ [key: string]: ITag[] }>(getTagsUrl(ids)),
    ...options,
  });
};

const getTagsUrl = (ids: number[]) =>
  `${getImageUrl()}/tags?${ids.map((id) => `ids=${id}`).join("&")}`;
