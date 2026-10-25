import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnvironment } from "@/lib/supabase/environment";
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
        const environment = getSupabasePublicEnvironment();
        // Always anonymous: an owner browsing the public site must not widen reads.
        const supabase = createClient(
          environment.url,
          environment.publishableKey,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
            global: {
              fetch: (input, init) =>
                fetch(input, { ...init, cache: "no-store" }),
            },
          },
        );
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
