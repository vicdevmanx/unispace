import { Locate, MapPin, Pointer, Star } from "lucide-react";



const WorkspaceCard = ({ workspace, onClick = '' }) => {

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
            } else {
                stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        // Workspace Card Container
        <div
            key={workspace.id}
            className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all border duration-300 ease-out cursor-pointer group hover:scale-103 hover:shadow-2xl hover:-translate-y-2"
            onClick={onClick}
        >
            {/* Image & Category/Location Badges */}
            <div className="relative">
            <img
                src={workspace.image}
                alt={workspace.name}
                className="w-full h-48 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
                {/* Location Badge */}
                <span className="flex items-center gap-1 absolute bottom-3 right-3 bg-[#1D3A8A] text-white text-xs px-3 py-1 rounded-lg font-semibold shadow">
                    <MapPin className="w-3 h-4 text-white" />
                    {workspace.location}
                </span>
            </div>
            {/* Card Content */}
            <div className="p-4 flex flex-col justify-between gap-3">
                {/* Provider Info */}
                <div className="flex items-center space-x-3">
                    <img
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${workspace.provider}`}
                        alt={workspace.provider}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-sm font-semibold text-neutral-700">{workspace.provider}</p>
                    </div>
                </div>
                {/* Workspace Name */}
                <h3 className="font-bold text-xl text-neutral-900">{workspace.name}</h3>
                {/* Rating */}
                <div className="flex items-center text-yellow-500 text-sm font-medium">
                    {renderStars(workspace.rating)}
                    <span className="text-gray-500 ml-1 font-normal">({workspace.rating})</span>
                </div>
                {/* Description */}
                <p className="text-gray-500 font-regular text-sm leading-snug line-clamp-2">
                    {workspace.description}
                </p>
                <hr />
                {/* Price & Book Button */}
                <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-[#1D3A8A]">₦{workspace.price}</p>
                        <span className="text-xs font-medium text-gray-500">/hr</span>
                    </div>
                    <button className="bg-[#1D3A8A] hover:bg-[#274ea6] transition-colors duration-200 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceCard