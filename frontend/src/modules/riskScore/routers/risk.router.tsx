import YourRisk from "../pages/yourRisk";
import RegionalRisk from "../pages/regionalRisk";

export const RiskRouter = [
  {
    path: "/risk",
    children: [
      {
        path: "yourscore", 
        element: <YourRisk />
      },
      {
        path: "region",
        element:<RegionalRisk/>
      }
    ]
  },
];
