import request from '@/utils/request';

export const searchBookService = params =>
  request('/api/search/:keyword', { params });

export const fetchBookService = params => request('/api/open/:id', { params });

export const fetchChapterService = (query, params) =>
  request('/api/article/:index', { query, params });
