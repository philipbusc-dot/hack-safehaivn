import { Outlet } from "react-router-dom";
import TempNav from "../public/tempnav";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-bg flex justify-center items-start md:items-center p-4">
      <TempNav />
      <div className="flex-1 min-h-0 w-full flex">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
