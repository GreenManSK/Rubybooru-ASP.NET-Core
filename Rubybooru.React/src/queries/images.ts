import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { IImage } from "../entities/image";
import React from "react";
import { useConfigContext } from "../providers/config-provider";

type ImagesOptions = {
  imagesPerPage: number;
  page: number;
};

export const ImageQueryKeys = {
  images: "images",
  image: "image",
  count: "count",
};

export const useImages = (options: ImagesOptions) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const url = `${getImageUrl()}${buildImagesQuery(options)}`;

  const result = useQuery({
    queryKey: [ImageQueryKeys.images, ...imagesOptionsToKey(options)],
    queryFn: () => client.get<IImage[]>(url),
  });

  const { isSuccess, data } = result;
  React.useEffect(() => {
    if (!isSuccess) return;
    data.forEach((image) =>
      queryClient.setQueryData([ImageQueryKeys.image, image.id], image)
    );
  }, [isSuccess, data, queryClient]);

  return result;
};

export const useImagesCount = (options: ImagesOptions) => {
  const client = useHttpClient();
  options = { ...options };
  options.page = 0;
  const url = `${getImageUrl()}count/${buildImagesQuery(options)}`;
  return useQuery({
    queryKey: [ImageQueryKeys.count, ...imagesOptionsToKey(options)],
    queryFn: () => client.get<number>(url),
  });
};

export const useImage = (id: number) => {};

export const useGetImagePreviewUrl = (
  id: number,
  width: number,
  height: number,
  keepAspectRatio = true
) => {
  const { restUrl } = useConfigContext();
  return `${restUrl}${getImageUrl(
    id
  )}/preview?width=${width}&height=${height}&keepAspectRatio=${keepAspectRatio}`;
};

export const getImageUrl = (id?: number) => `/image/${id ?? ""}`;

const buildImagesQuery = (options: ImagesOptions) => {
  const queries: string[] = [];

  if (options.imagesPerPage) {
    queries.push(`limit=${options.imagesPerPage}`);
  }

  if (options.page) {
    queries.push(`offset=${options.imagesPerPage * (options.page - 1)}`);
  }

  return `?${queries.join("&")}`;
};

const imagesOptionsToKey = (options: ImagesOptions) => [
  options.imagesPerPage,
  options.page,
];
