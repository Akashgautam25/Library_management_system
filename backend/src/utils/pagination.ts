export interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;   // e.g. "createdAt:desc" or "title:asc"
    search?: string;
    category?: string;
    status?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: PaginationMeta;
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export const parsePaginationQuery = (query: Record<string, any>): Required<PaginationQuery> => {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit as string) || DEFAULT_LIMIT));
    const sort = (query.sort as string) || 'createdAt:desc';
    const search = (query.search as string) || '';
    const category = (query.category as string) || '';
    const status = (query.status as string) || '';
    return { page, limit, sort, search, category, status };
};

export const parseSortString = (sort: string): Record<string, 1 | -1> => {
    const [field, order] = sort.split(':');
    const allowedFields = ['createdAt', 'title', 'author', 'category', 'availableQuantity', 'issueDate', 'dueDate'];
    if (!allowedFields.includes(field)) return { createdAt: -1 };
    return { [field]: order === 'asc' ? 1 : -1 };
};

export const buildPaginationMeta = (
    page: number,
    limit: number,
    total: number
): PaginationMeta => ({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
});
