import React, { PropsWithChildren } from "react";
import { ITag } from "../entities/tag";
import { useTags } from "../queries/tags";
import { Whisperer, WhispererEntity } from "../utils/whisperer";
import { useConfigContext } from "./config-provider";
import { InputParser } from "../utils/input-parser";

interface ITagUtilsContext {
  whisperer: (prefix: string, limit?: number) => WhispererEntity<ITag>[];
  inputParser: InputParser<ITag>;
}

const TagUtilsContext = React.createContext<ITagUtilsContext>({
  whisperer: () => [],
  inputParser: null!,
});

export const useTagUtils = () => React.useContext(TagUtilsContext);

export const TagUtilsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { tagTypeOrder, tagWhispererLimit } = useConfigContext();
  const { data: tags } = useTags();

  const whisperer = React.useMemo(
    () =>
      new Whisperer(tags ?? [], (a: any, b: any) => {
        if (a.type === b.type) {
          return b.count - a.count;
        }
        return tagTypeOrder.indexOf(a.type) < tagTypeOrder.indexOf(b.type)
          ? -1
          : 1;
      }),
    [tags, tagTypeOrder]
  );

  const inputParser = React.useMemo(
    () => new InputParser<ITag>(tags ?? []),
    [tags]
  );

  const whispererFunction = React.useCallback(
    (prefix: string, limit = tagWhispererLimit) =>
      whisperer.whisper(prefix, limit),
    [whisperer, tagWhispererLimit]
  );

  return (
    <TagUtilsContext.Provider
      value={{ whisperer: whispererFunction, inputParser }}
    >
      {children}
    </TagUtilsContext.Provider>
  );
};
