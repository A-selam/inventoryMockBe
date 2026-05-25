import { config } from '../config';

export const delay = async () => {
  const ms = Math.floor(
    Math.random() * (config.maxDelayMs - config.minDelayMs + 1) + config.minDelayMs
  );
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const paginate = <T>(
  data: T[],
  page: number,
  limit: number
) => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    total,
    page,
    limit,
    total_pages: totalPages,
    data: paginatedData
  };
};

export const sortData = <T>(
  data: T[],
  sortBy: keyof T,
  sortDir: 'asc' | 'desc' = 'asc'
) => {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
};

export const searchData = <T>(
  data: T[],
  search: string,
  fields: (keyof T)[]
) => {
  const searchLower = search.toLowerCase();
  return data.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(searchLower);
    })
  );
};

export const generateId = () => {
  return crypto.randomUUID();
};
