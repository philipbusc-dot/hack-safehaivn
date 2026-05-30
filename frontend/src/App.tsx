import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="w-screen h-screen bg-bg flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default App;
