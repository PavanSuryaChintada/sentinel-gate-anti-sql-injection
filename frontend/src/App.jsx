import { useState, useCallback } from 'react';
import {
  Navbar,
  Hero,
  SentinelInterceptor,
  FeatureGrid,
  ScriptTagDemo,
  AIShield,
  DemoSection,
  DatabaseSchema,
  AttackTypes,
  AboutSection,
  ChatbotModal,
  Footer,
} from './components/landing';
import { resetDatabase } from './api';

function App() {
  const [chatbotShow, setChatbotShow] = useState(false);

  const handleReset = useCallback(async () => {
    if (!window.confirm('Reset database to default values?')) return;
    try {
      const data = await resetDatabase();
      alert(data.message);
    } catch (err) {
      alert('Failed to reset database.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar onResetDatabase={handleReset} />
      <main>
        <Hero />
        <SentinelInterceptor />
        <FeatureGrid />
        <ScriptTagDemo />
        <AIShield />
        <DemoSection onOpenChatbot={() => setChatbotShow(true)} />
        <DatabaseSchema />
        <AttackTypes />
        <AboutSection />
      </main>
      <Footer />
      <ChatbotModal show={chatbotShow} onHide={() => setChatbotShow(false)} />
    </div>
  );
}

export default App;
