// import Hero from "../components/Hero";
import WorkspaceServicesDetail from "../components/WorkspaceServicesDetail";
import WorkspaceLayout from "../workspace-layout";

const WorkspaceService = () => {
  return (
    <div className="bg-[1d3a8a]/5">
  <WorkspaceLayout>
    {/* <Hero /> */}
    <WorkspaceServicesDetail workspace={{
      id: 1,
    category: 'Coworking Space',
    provider: 'Guru Innovations',
    name: 'Guru Innovation Hub',
    rating: 4.5,
    price: 300,
    image: '/huboutside.webp',
    description: 'The Guru Innovation Hub is a lively coworking space at 74 Ettagbor, Cross River State, Nigeria, run by Guru Innovations. Categorized as a "Coworking Space," it’s a hub for technologists and entrepreneurs, fostering innovation with a 4.5 rating and a monthly price of $250. The exterior image showcases modern glass architecture, reflecting its open vibe. Located in a strategic spot with green views, it offers a peaceful yet convenient setting..',
    location: '74 Ettagbor',
    amenities: ['Bathroom', 'Community', 'Starlink', '1 Car Garage']
    }} />
  </WorkspaceLayout>
  </div>)
};

export default WorkspaceService;
