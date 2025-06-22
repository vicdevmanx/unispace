import Navbar from "./components/navbar";


const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#1D3A8A]/5">
        <Navbar/>
        <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
       
    </div>
  );
}

export default WorkspaceLayout;