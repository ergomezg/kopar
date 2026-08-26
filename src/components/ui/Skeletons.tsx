import React from 'react';

export const BalanceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#ffffff] border border-[#dedfe2] rounded-[24px] p-6 shadow-xs animate-pulse">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-3.5 bg-[#eef0f3] rounded-full w-28" />
        <div className="h-6 bg-[#eef0f3] rounded-full w-20" />
      </div>

      {/* Main balance amount */}
      <div className="h-10 bg-[#eef0f3] rounded-full w-48 mb-2" />
      <div className="h-3 bg-[#eef0f3] rounded-full w-40 mb-6" />

      {/* Secondary balances breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#dedfe2]">
        <div className="bg-[#f7f8f9] p-3 rounded-[16px] border border-[#dedfe2]/60 space-y-2">
          <div className="h-3 bg-[#eef0f3] rounded-full w-16" />
          <div className="h-5 bg-[#eef0f3] rounded-full w-24" />
        </div>
        <div className="bg-[#f7f8f9] p-3 rounded-[16px] border border-[#dedfe2]/60 space-y-2">
          <div className="h-3 bg-[#eef0f3] rounded-full w-16" />
          <div className="h-5 bg-[#eef0f3] rounded-full w-24" />
        </div>
      </div>
    </div>
  );
};

export const ActivitySkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-[#eef0f3] rounded-full w-32" />
        <div className="h-3 bg-[#eef0f3] rounded-full w-16" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#ffffff] p-4 rounded-[16px] border border-[#dedfe2] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#eef0f3] shrink-0" />
            <div className="space-y-2 min-w-0">
              <div className="h-4 bg-[#eef0f3] rounded-full w-28" />
              <div className="h-3 bg-[#eef0f3] rounded-full w-40" />
            </div>
          </div>
          <div className="space-y-2 shrink-0 text-right">
            <div className="h-4 bg-[#eef0f3] rounded-full w-16 ml-auto" />
            <div className="h-3 bg-[#eef0f3] rounded-full w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const BudgetSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header bar card */}
      <div className="bg-[#ffffff] border border-[#dedfe2] rounded-[24px] p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#eef0f3] rounded-full w-36" />
          <div className="h-6 bg-[#eef0f3] rounded-full w-20" />
        </div>
        <div className="h-3 bg-[#eef0f3] rounded-full w-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 bg-[#eef0f3] rounded-full w-24" />
          <div className="h-3 bg-[#eef0f3] rounded-full w-24" />
        </div>
      </div>

      {/* Category cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#ffffff] border border-[#dedfe2] rounded-[16px] p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef0f3]" />
              <div className="space-y-2">
                <div className="h-4 bg-[#eef0f3] rounded-full w-24" />
                <div className="h-3 bg-[#eef0f3] rounded-full w-32" />
              </div>
            </div>
            <div className="h-4 bg-[#eef0f3] rounded-full w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
