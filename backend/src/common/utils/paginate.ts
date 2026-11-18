export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Mengubah page/limit menjadi skip/take untuk Prisma. */
export function toSkipTake(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit };
}

/** Membentuk respons list { data, meta } sesuai kontrak API. */
export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): Paginated<T> {
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}