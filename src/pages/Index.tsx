
import { Navigate } from 'react-router-dom';

// Directly redirect to hosts page from index
const Index = () => {
  return <Navigate to="/hosts" replace />;
};

export default Index;
