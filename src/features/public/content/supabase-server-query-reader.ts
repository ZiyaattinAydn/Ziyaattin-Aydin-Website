import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PublicQueryReader,
  PublicQueryRequest,
  PublicQueryResponse,
} from "@/features/public/content/supabase-query-reader";

export function createSupabaseServerPublicQueryReader(): PublicQueryReader {
  return {
    async execute<TRow>(
      request: PublicQueryRequest,
    ): Promise<PublicQueryResponse<TRow>> {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase
          .from(request.table)
          .select(request.columns.join(","));

        for (const filter of request.filters) {
          if (filter.operator === "eq") {
            query = query.eq(filter.column, filter.value);
            continue;
          }

          if (filter.operator === "not") {
            query = query.not(filter.column, "is", null);
            continue;
          }

          query = query.in(filter.column, [...filter.value]);
        }

        for (const order of request.order ?? []) {
          query = query.order(order.column, {
            ascending: order.ascending,
            ...(order.nullsFirst === undefined
              ? {}
              : { nullsFirst: order.nullsFirst }),
          });
        }

        if (request.limit !== undefined) {
          query = query.limit(request.limit);
        }

        if (request.result === "maybe-single") {
          const response = await query.maybeSingle();

          return {
            data: response.data as TRow | null,
            error: response.error,
          };
        }

        const response = await query;

        return {
          data: (response.data ?? []) as TRow[],
          error: response.error,
        };
      } catch {
        return {
          data: null,
          error: new Error("Public Supabase query could not be executed."),
        };
      }
    },
  };
}
