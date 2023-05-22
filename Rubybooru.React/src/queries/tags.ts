import { ITag } from "./../entities/tag";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { getImageUrl } from "./images";

const TagQueryKeys = {
  tags: "tags",
  imageTags: "image-tags",
};

export const useTags = (
  ids: number[],
  options: UseQueryOptions<{ [key: string]: ITag[] }> = {}
) => {
  const client = useHttpClient();

  return useQuery<{ [key: string]: ITag[] }>({
    queryKey: [TagQueryKeys.tags, ...ids],
    queryFn: () => client.get<{ [key: string]: ITag[] }>(getTagsUrl(ids)),
    ...options,
  });
};

export const useImageTags = (id: number) => {
  const client = useHttpClient();
  return useQuery<ITag[]>({
    queryKey: [TagQueryKeys.imageTags, id],
    queryFn: () => client.get<ITag[]>(`${getImageUrl(id)}/tag`),
  });
};

const getTagsUrl = (ids: number[]) =>
  `${getImageUrl()}/tags?${ids.map((id) => `ids=${id}`).join("&")}`;
