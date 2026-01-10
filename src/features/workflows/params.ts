import { parseAsInteger, parseAsString } from "nuqs/server";

import { PAGINATION } from "@/config/constants";

/**
 * e.g. http://localhost:3000?page=1 is equal to http://localhost:3000 since the default page is 1
 * 
 * clearOnDefault: true is used to remove the '?page=1'
 */
export const workflowsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),
}
