import React from 'react';

export const BookCardSkeleton: React.FC = () => (
    <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-6 bg-white/10 rounded-full" />
            <div className="w-20 h-6 bg-white/10 rounded-full" />
        </div>
        <div className="w-3/4 h-6 bg-white/10 rounded-md mb-2" />
        <div className="w-1/2 h-4 bg-white/10 rounded-md mb-6" />
        <div className="space-y-2 mb-6">
            <div className="w-full h-3 bg-white/10 rounded-md" />
            <div className="w-5/6 h-3 bg-white/10 rounded-md" />
        </div>
        <div className="w-full h-10 bg-white/10 rounded-xl" />
    </div>
);

export const DashboardCardSkeleton: React.FC = () => (
    <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 animate-pulse h-36">
        <div className="flex justify-between items-start">
            <div>
                <div className="w-24 h-4 bg-white/10 rounded-md mb-2" />
                <div className="w-16 h-8 bg-white/10 rounded-md" />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl" />
        </div>
        <div className="w-32 h-4 bg-white/10 rounded-md mt-6" />
    </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-white/5 animate-pulse">
        {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded-md flex-1" />
        ))}
    </div>
);

export const PageHeaderSkeleton: React.FC = () => (
    <div className="mb-8 animate-pulse">
        <div className="w-1/3 h-8 bg-white/10 rounded-md mb-2" />
        <div className="w-1/4 h-4 bg-white/10 rounded-md" />
    </div>
);
