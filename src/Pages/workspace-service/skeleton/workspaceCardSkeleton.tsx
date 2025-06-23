const WorkspaceCardSkeleton = () => {
  return (
    <>
      {/* Skeleton Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all border duration-300 ease-out cursor-pointer animate-pulse">
        {/* Skeleton Image & Badges */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-200"></div>

          {/* Location Badge */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1 h-5 w-24 bg-[#1D3A8A]/60 rounded-lg shadow"></span>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col justify-between gap-3">
          {/* Provider Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#1D3A8A]/60 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>

          {/* Workspace Name */}
          <div className="h-5 w-3/4 bg-gray-300 rounded"></div>

          {/* Rating */}
          <div className="h-4 w-28 bg-gray-300 rounded"></div>

          {/* Description */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
          </div>

          <hr />

          {/* Price & Button */}
          <div className="flex items-end justify-between">
            <div className="h-6 w-24 bg-[#1D3A8A]/60 rounded"></div>
            <div className="h-8 w-20 bg-[#1D3A8A]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};


export default WorkspaceCardSkeleton