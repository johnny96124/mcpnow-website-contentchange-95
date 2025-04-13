
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect based on user state
const Index = () => {
  const navigate = useNavigate();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    // In a real app this would check user metadata, local storage, or an API
    const hasVisitedBefore = localStorage.getItem('mcpnow-visited');
    
    if (!hasVisitedBefore) {
      // Mark as visited
      localStorage.setItem('mcpnow-visited', 'true');
      setIsFirstVisit(true);
      navigate('/new-user');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return null; // This won't render as we're redirecting
};

export default Index;
