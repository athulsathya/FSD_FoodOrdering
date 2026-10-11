import { GiForkKnifeSpoon } from "react-icons/gi";

function Navbar() {
  return (
    <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes group/nav overflow-x-hidden">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow-[0_0_20px] shadow-amber-600/50">
          <div className="flex justify-between px-6">
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4-ml-2 rotate-45" size={32}/>
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4-mr-2 rotate-45" size={32}/>
          </div>
        </div>
        {/* MAIN NAVIGATION CONTAINER */}
        <div className="">
          <div>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
