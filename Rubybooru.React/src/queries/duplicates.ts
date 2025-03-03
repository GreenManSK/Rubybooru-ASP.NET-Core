import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { DuplicatesOptions, duplicatesOptionsToKey } from "./types";
import {
  getDuplicateResolveUrl,
  getDuplicateUrl,
  getDuplicatesCountUrl,
  getDuplicatesUrl,
} from "./duplicates-urls";
import { DuplicateRecordResolution, IDuplicateRecord } from "../entities/duplicate-record";
import React from "react";

export const DuplicateKeys = {
  duplicates: "duplicates",
  duplicatesCount: "duplicates-count",
  duplicate: "duplicate",
};

export const useDuplicates = (options: DuplicatesOptions) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const url = getDuplicatesUrl(options);

  const result = useQuery({
    queryKey: [DuplicateKeys.duplicates, ...duplicatesOptionsToKey(options)],
    queryFn: () => client.get<IDuplicateRecord[]>(url),
  });

  const { isSuccess, data } = result;
  React.useEffect(() => {
    if (!isSuccess) return;
    data?.forEach((duplicate) =>
      queryClient.setQueryData(
        [DuplicateKeys.duplicate, duplicate.id],
        duplicate
      )
    );
  }, [isSuccess, data, queryClient]);

  return result;
};

export const useDuplicatesCount = () => {
  const client = useHttpClient();
  return useQuery({
    queryKey: [DuplicateKeys.duplicatesCount],
    queryFn: () => client.get<number>(getDuplicatesCountUrl()),
  });
};

export const useDuplicate = (id: number) => {
  const client = useHttpClient();
  return useQuery({
    queryKey: [DuplicateKeys.duplicate, id],
    queryFn: () => client.get<IDuplicateRecord>(getDuplicateUrl(id)),
  });
};

export const useResolveDuplicate = (id: number) => {
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const queryKeys = [DuplicateKeys.duplicates, DuplicateKeys.duplicatesCount];

  return useMutation({
    mutationFn: (data: {
      resolution: DuplicateRecordResolution;
      mergeTags: boolean;
    }) =>
      client.get<void>(
        getDuplicateResolveUrl(id, data.resolution, data.mergeTags)
      ),
    onSuccess: () => {
      queryKeys.forEach((queryKey) => queryClient.removeQueries([queryKey]));
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries([queryKey])
      );
    },
  });
};
