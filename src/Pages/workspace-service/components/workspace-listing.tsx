import WorkspaceCardSkeleton from "../skeleton/workspaceCardSkeleton";
import WorkspaceCard from "./workspace-card";

const WorkspaceListing = () => {

type Workspace = {
    id: number;
    category: string;
    provider: string;
    name: string;
    rating: number;
    price: number;
    image: string;
    description: string;
    location: string;
    amenities: string[];
};

const workspaceListing: Workspace[] = [
    {
        id: 1,
        category: "Business Center",
        provider: "Elite Business Suites",
        name: "Executive Conference Room",
        rating: 4.9,
        price: 300,
        image: "/huboutside.webp",
        description: "A premium space for high-level meetings and presentations.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 2,
        category: "Tech Campus",
        provider: "CodeLab Academy",
        name: "Coding Bootcamp Lab",
        rating: 3.6,
        price: 18,
        image: "/b1.webp",
        description:
            "A collaborative space designed for coding bootcamps and tech workshops.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 3,
        category: "University District",
        provider: "CollabSpace",
        name: "Open Collaboration Space",
        rating: 4.4,
        price: 12,
        image: "/c3.webp",
        description:
            "A vibrant area for students and professionals to collaborate and innovate.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    // Add 6 more
    {
        id: 4,
        category: "Remote Hub",
        provider: "Starlink Pods",
        name: "Private Booth with Starlink",
        rating: 2.8,
        price: 22,
        image: "/c2.webp",
        description:
            "A private booth equipped with Starlink for high-speed internet access.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 5,
        category: "Campus Corner",
        provider: "CampusBox",
        name: "Quiet Study Room",
        rating: 4.7,
        price: 15,
        image: "/huboutside.webp",
        description: "A serene space for focused study and academic work.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 6,
        category: "Innovation Lab",
        provider: "ThinkTank Studios",
        name: "Design Thinking Room",
        rating: 4.5,
        price: 20,
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
        description:
            "A creative space designed for brainstorming and design thinking sessions.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 7,
        category: "Media Hub",
        provider: "Vibe Studios",
        name: "Podcast & Recording Booth",
        rating: 4.3,
        price: 25,
        image: "/c3.webp",
        description: "A soundproof booth for podcasting and audio recording.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 8,
        category: "Reading Zone",
        provider: "LitLounge",
        name: "Silent Reading Space",
        rating: 4.6,
        price: 10,
        image: "/huboutside.webp",
        description: "A quiet and comfortable space for reading and relaxation.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
    {
        id: 9,
        category: "Creative Loft",
        provider: "ArtLab",
        name: "Open Brainstorm Studio",
        rating: 4.2,
        price: 19,
        image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
        description:
            "A spacious studio for creative brainstorming and artistic projects.",
        location: "Downtown Business District",
        amenities: ["Wi-Fi", "Projector", "Whiteboard", "Coffee"],
    },
];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto lg:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {workspaceListing ? 
           workspaceListing.map((workspace) => (
            <WorkspaceCard workspace={workspace} />
          )) : Array(6).fill(0).map((_, i) => <WorkspaceCardSkeleton key={i} />)

            }


        {/* Pagination */}
        <div className="col-span-full flex justify-center mt-8">
            <nav className="inline-flex items-center space-x-2" aria-label="Pagination">
                <button
                    className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                    disabled
                    aria-label="Previous page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button className="px-3 py-1 rounded-full bg-[#1D3A8A] text-white font-semibold">1</button>
                {/* <button className="px-3 py-1 rounded-full hover:bg-neutral-200">2</button>
                <button className="px-3 py-1 rounded-full hover:bg-neutral-200">3</button> */}
                <span className="px-2">...</span>
                {/* <button className="px-3 py-1 rounded-full hover:bg-neutral-200">5</button> */}
                <button
                    className="p-2 rounded-full hover:bg-neutral-200"
                    aria-label="Next page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </nav>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceListing;
