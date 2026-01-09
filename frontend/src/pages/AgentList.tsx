import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';

// For now, AgentList is just an alias for Dashboard
// In the future, this could have a more detailed table view
export default function AgentList() {
  return <Dashboard />;
}
