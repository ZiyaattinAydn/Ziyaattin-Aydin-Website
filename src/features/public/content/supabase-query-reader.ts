import type {
  PublishState,
  PublicVisibility,
} from "@/features/public/content/model";

export type PublicContentTable =
  | "projects"
  | "writings"
  | "journey_items";

export type PublicQueryFilter =
  | {
      column: string;
      operator: "eq";
      value: string | number | boolean;
    }
  | {
      column: string;
      operator: "not";
      value: null;
    }
  | {
      column: string;
      operator: "in";
      value: readonly string[];
    };

export type PublicQueryOrder = {
  column: string;
  ascending: boolean;
  nullsFirst?: boolean;
};

export type PublicQueryRequest = {
  table: PublicContentTable;
  columns: readonly string[];
  filters: readonly PublicQueryFilter[];
  order?: readonly PublicQueryOrder[];
  limit?: number;
  result: "many" | "maybe-single";
};

export type PublicQueryResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: unknown;
};

export interface PublicQueryReader {
  execute<TRow>(
    request: PublicQueryRequest,
  ): Promise<PublicQueryResponse<TRow>>;
}

export const PUBLIC_ACCESS_FILTERS = [
  {
    column: "visibility",
    operator: "eq",
    value: "public" satisfies PublicVisibility,
  },
  {
    column: "publish_state",
    operator: "eq",
    value: "published" satisfies PublishState,
  },
  {
    column: "published_at",
    operator: "not",
    value: null,
  },
] as const satisfies readonly PublicQueryFilter[];
