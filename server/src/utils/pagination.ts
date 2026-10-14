export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(
  pageStr?: string,
  limitStr?: string,
): PaginationParams {
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr ?? '20', 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationParams,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
