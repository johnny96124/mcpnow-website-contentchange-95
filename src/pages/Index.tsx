
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to the dashboard from the index
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null; // This won't render as we're redirecting
};

export default Index;
