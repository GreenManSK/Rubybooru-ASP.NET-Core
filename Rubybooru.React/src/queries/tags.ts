import { ITag, TagType } from "./../entities/tag";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { getImagesTagsUrl, getImageTagUrl, getTagUrl } from "./tag-urls";

const TagQueryKeys = {
  tags: "tags",
  imagesTags: "images-tags",
  imageTags: "image-tags",
};

export const useTags = () => {
  const client = useHttpClient();

  return useQuery<ITag[]>({
    queryKey: [TagQueryKeys.tags],
    queryFn: () => client.get<ITag[]>(getTagUrl()),
  });
};

export const useImagesTags = (
  ids: number[],
  options: UseQueryOptions<{ [key: string]: ITag[] }> = {}
) => {
  const client = useHttpClient();

  return useQuery<{ [key: string]: ITag[] }>({
    queryKey: [TagQueryKeys.imagesTags, ...ids],
    queryFn: () => client.get<{ [key: string]: ITag[] }>(getImagesTagsUrl(ids)),
    ...options,
  });
};

export const useImageTags = (id: number) => {
  const client = useHttpClient();
  return useQuery<ITag[]>({
    queryKey: [TagQueryKeys.imageTags, id],
    queryFn: () => client.get<ITag[]>(getImageTagUrl(id)),
  });
};

export const useRemoveImageTag = (imageId: number) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKey = [TagQueryKeys.imageTags, imageId];

  return useMutation({
    mutationFn: (tagId: number) =>
      client.delete(getImageTagUrl(imageId, tagId)),
    onMutate: (tagId) => {
      const previousTags = queryClient.getQueryData<ITag[]>(queryKey);
      queryClient.setQueryData<ITag[]>(queryKey, (old) =>
        old?.filter((t) => t.id !== tagId)
      );
      return () => queryClient.setQueryData(queryKey, previousTags);
    },
    onError: (_, __, rollback) =>
      typeof rollback === "function" ? rollback() : null,
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useAddImageTag = (imageId: number) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKey = [TagQueryKeys.imageTags, imageId];

  return useMutation({
    mutationFn: (tag: ITag) => client.post(getImageTagUrl(imageId, tag.id)),
    onMutate: (tag) => {
      const previousTags = queryClient.getQueryData<ITag[]>(queryKey);
      queryClient.setQueryData<ITag[]>(queryKey, (old) =>
        old ? [...old, tag] : [tag]
      );
      return () => queryClient.setQueryData(queryKey, previousTags);
    },
    onError: (_, __, rollback) =>
      typeof rollback === "function" ? rollback() : null,
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useAddTag = () => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKey = [TagQueryKeys.tags];
  return useMutation({
    mutationFn: (data: { name: string; type: TagType }) =>
      client.post(getTagUrl(), data),
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useEditTag = () => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKey = [TagQueryKeys.tags];
  return useMutation({
    mutationFn: (tag: ITag) => client.put(getTagUrl(tag.id), tag),
    onMutate: (tag: ITag) => {
      const previousTags = queryClient.getQueryData<ITag[]>(queryKey);
      queryClient.setQueryData<ITag[]>(queryKey, (old) =>
        old ? [...old?.filter((t) => t.id !== tag.id), tag] : [tag]
      );
      return () => queryClient.setQueryData(queryKey, previousTags);
    },
    onError: (_, __, rollback) =>
      typeof rollback === "function" ? rollback() : null,
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useDeleteTag = () => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKey = [TagQueryKeys.tags];

  return useMutation({
    mutationFn: (tagId: number) => client.delete(getTagUrl(tagId)),
    onMutate: (tagId) => {
      const previousTags = queryClient.getQueryData<ITag[]>(queryKey);
      queryClient.setQueryData<ITag[]>(queryKey, (old) =>
        old?.filter((t) => t.id !== tagId)
      );
      return () => queryClient.setQueryData(queryKey, previousTags);
    },
    onError: (_, __, rollback) =>
      typeof rollback === "function" ? rollback() : null,
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};
