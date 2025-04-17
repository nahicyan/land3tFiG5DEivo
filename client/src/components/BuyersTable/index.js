// Main exports for the BuyersTable module
import BuyersContainer from './BuyersContainer';
import BuyersTable from './BuyersTable';
import BuyersTableBase from './BuyersTableBase';
import BuyerStats from './BuyerStats';
import BuyerAreasTab from './BuyerAreasTab';
import ActivityDetailView from './ActivityDetailView';

// Re-export for easy imports
export { BuyersTable, BuyersTableBase, BuyerStats, BuyerAreasTab, ActivityDetailView };
export default BuyersContainer;

// Export constants and utility functions
export * from './buyerConstants';