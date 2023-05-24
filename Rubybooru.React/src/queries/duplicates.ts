import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { DuplicatesOptions, duplicatesOptionsToKey } from "./types";
import { getDuplicatesCountUrl, getDuplicatesUrl } from "./duplicates-urls";
import { IDuplicateRecord } from "../entities/duplicate-record";
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
