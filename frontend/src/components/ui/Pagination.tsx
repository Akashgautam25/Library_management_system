import React from 'react';

interface PaginationProps {
    page: number;
    pages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, pages, total, limit, onPageChange }) => {
    if (pages <= 1) return null;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const getPageNumbers = () => {
        const nums: (number | '...')[] = [];
        if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
        nums.push(1);
        if (page > 3) nums.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
        if (page < pages - 2) nums.push('...');
        nums.push(pages);
        return nums;
    };

    return (
        <div className="pagination-wrapper">
            <span className="pagination-info">Showing {start}–{end} of {total}</span>
            <div className="pagination-controls">
                <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
                {getPageNumbers().map((n, i) =>
                    n === '...' ? (
                        <span key={`e${i}`} className="page-ellipsis">…</span>
                    ) : (
                        <button key={n} className={`page-btn ${page === n ? 'active' : ''}`} onClick={() => onPageChange(n as number)}>{n}</button>
                    )
                )}
                <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page === pages}>›</button>
            </div>
        </div>
    );
};

export default Pagination;
