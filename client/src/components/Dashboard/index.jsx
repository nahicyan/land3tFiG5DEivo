// client/src/components/Dashboard/index.jsx

// Main dashboard component
import DashboardPage from "./DashboardPage";

// Export all widget components
import StatCards from "./widgets/StatCards";
import FinanceWidget from "./widgets/FinanceWidget";
import ActivityWidget from "./widgets/ActivityWidget";
import OffersWidget from "./widgets/OffersWidget";
import PropertiesWidget from "./widgets/PropertiesWidget";
import BuyersWidget from "./widgets/BuyersWidget";
import BuyerListsWidget from "./widgets/BuyerListsWidget";
import EmailReportWidget from "./widgets/EmailReportWidget";
import QualificationsWidget from "./widgets/QualificationsWidget";
import VisitorsWidget from "./widgets/VisitorsWidget";
import DealsWidget from "./widgets/DealsWidget"; 

// Default export is the main dashboard
export default DashboardPage;

// Named exports for individual components
export {
  StatCards,
  FinanceWidget,
  ActivityWidget,
  OffersWidget,
  PropertiesWidget,
  BuyersWidget,
  BuyerListsWidget,
  EmailReportWidget,
  QualificationsWidget,
  VisitorsWidget,
  DealsWidget
};

// Utility functions specific to the dashboard could also be exported here
export { default as dashboardUtils } from "./utils/dashboardData";