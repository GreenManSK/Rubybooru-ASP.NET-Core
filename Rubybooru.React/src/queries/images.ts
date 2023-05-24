import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { IImage } from "../entities/image";
import React from "react";
import {
  SearchImagesOptions,
  UntaggedImagesOptions,
  imagesOptionsToKey,
  untaggedImagesOptionsToKey,
} from "./types";
import {
  getImageSearchCountUrl,
  getImageSearchUrl,
  getImageUrl,
  getUntaggedCountUrl,
  getUntaggedUrl,
  getUntaggedYearsUrl,
} from "./image-urls";

export const ImageQueryKeys = {
  images: "images",
  image: "image",
  count: "count",
  untagged: "untagged",
  untaggedCount: "untagged-count",
  untaggedYears: "untagged-years",
};

const useUpdateImagesInCache = (
  queryClient: QueryClient,
  isSuccess: boolean,
  data?: IImage[]
) => {
  React.useEffect(() => {
    if (!isSuccess) return;
    data?.forEach((image) =>
      queryClient.setQueryData([ImageQueryKeys.image, image.id], image)
    );
  }, [isSuccess, data, queryClient]);
};

export const useImages = (options: SearchImagesOptions) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const url = getImageSearchUrl(options);

  const result = useQuery({
    queryKey: [ImageQueryKeys.images, ...imagesOptionsToKey(options)],
    queryFn: () => client.get<IImage[]>(url),
  });

  const { isSuccess, data } = result;
  useUpdateImagesInCache(queryClient, isSuccess, data);

  return result;
};

export const useImagesCount = (options: SearchImagesOptions) => {
  const client = useHttpClient();
  options = { ...options };
  options.page = 0;
  const url = getImageSearchCountUrl(options);
  return useQuery({
    queryKey: [ImageQueryKeys.count, ...imagesOptionsToKey(options)],
    queryFn: () => client.get<number>(url),
  });
};

export const useImage = (id: number) => {
  const client = useHttpClient();
  return useQuery({
    queryKey: [ImageQueryKeys.image, id],
    queryFn: () => client.get<IImage>(getImageUrl(id)),
  });
};

export const useDeleteImage = (id: number) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => client.delete(getImageUrl(id)),
    onSuccess: () => {
      queryClient.removeQueries([ImageQueryKeys.images]);
      queryClient.invalidateQueries([ImageQueryKeys.images]);
    },
  });
};

export const useUntaggedImages = (options: UntaggedImagesOptions) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const url = getUntaggedUrl(options);

  const result = useQuery({
    queryKey: [ImageQueryKeys.untagged, ...untaggedImagesOptionsToKey(options)],
    queryFn: () => client.get<IImage[]>(url),
  });

  const { isSuccess, data } = result;
  useUpdateImagesInCache(queryClient, isSuccess, data);

  return result;
};

export const useUntaggedImagesCount = (options: UntaggedImagesOptions) => {
  const client = useHttpClient();
  options = { ...options };
  options.page = 0;
  const url = getUntaggedCountUrl(options);
  return useQuery({
    queryKey: [
      ImageQueryKeys.untaggedCount,
      ...untaggedImagesOptionsToKey(options),
    ],
    queryFn: () => client.get<number>(url),
  });
};

export const useUntaggedYears = () => {
  const client = useHttpClient();
  return useQuery({
    queryKey: [ImageQueryKeys.untaggedYears],
    queryFn: () => client.get<number[]>(getUntaggedYearsUrl()),
  });
};
