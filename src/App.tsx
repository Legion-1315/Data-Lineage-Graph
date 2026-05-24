import React from 'react';
import { LineageGraph } from './components/LineageGraph';
import { LineageProvider } from './store/LineageContext';

const App: React.FC = () => (
  <LineageProvider>
    <LineageGraph />
  </LineageProvider>
);

export default App;
