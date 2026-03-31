import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';
import Step5 from './pages/Step5';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="step/1" element={<Step1 />} />
          <Route path="step/2" element={<Step2 />} />
          <Route path="step/3" element={<Step3 />} />
          <Route path="step/4" element={<Step4 />} />
          <Route path="step/5" element={<Step5 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;