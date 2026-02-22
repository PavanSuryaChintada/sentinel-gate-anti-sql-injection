import { useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import {
  Navbar,
  HeroSection,
  QueryPanel,
  TestCases,
  DatabaseSchema,
  AttackTypes,
  AboutSection,
  ChatbotModal,
  Footer,
} from './components';
import { queryEndpoint } from './api';

const defaultInput = "Admin' OR '1'='1";

function App() {
  const [chatbotShow, setChatbotShow] = useState(false);

  const [vulnState, setVulnState] = useState({
    input: defaultInput,
    table: 'secrets',
    result: null,
    loading: false,
    queryExecuted: null,
  });

  const [secureState, setSecureState] = useState({
    input: defaultInput,
    table: 'secrets',
    result: null,
    loading: false,
  });

  const runVulnQuery = useCallback(async (input, table, testCase = null) => {
    setVulnState((s) => ({ ...s, loading: true, result: null, queryExecuted: null }));
    try {
      const data = await queryEndpoint('vulnerable', input, table, testCase);
      setVulnState((s) => ({
        ...s,
        input,
        table,
        result: data,
        queryExecuted: data.query_executed || null,
        loading: false,
      }));
    } catch (err) {
      setVulnState((s) => ({
        ...s,
        result: { status: 'error', message: err.message },
        loading: false,
      }));
    }
  }, []);

  const runSecureQuery = useCallback(async (input, table, testCase = null) => {
    setSecureState((s) => ({ ...s, loading: true, result: null }));
    try {
      const data = await queryEndpoint('secure', input, table, testCase);
      setSecureState((s) => ({
        ...s,
        input,
        table,
        result: data,
        loading: false,
      }));
    } catch (err) {
      setSecureState((s) => ({
        ...s,
        result: { status: 'error', message: err.message },
        loading: false,
      }));
    }
  }, []);

  function handleVulnSubmit(val, table) {
    runVulnQuery(val, table);
  }

  function handleSecureSubmit(val, table) {
    runSecureQuery(val, table);
  }

  function handleRunVuln({ input, table, data }) {
    setVulnState((s) => ({
      ...s,
      input,
      table,
      result: data,
      queryExecuted: data?.query_executed || null,
      loading: false,
    }));
  }

  function handleRunSecure({ input, table, data }) {
    setSecureState((s) => ({
      ...s,
      input,
      table,
      result: data,
      loading: false,
    }));
  }

  return (
    <>
      <Navbar />
      <Container>
        <HeroSection onOpenChatbot={() => setChatbotShow(true)} />

        <div className="row g-4">
          <div className="col-lg-6">
            <QueryPanel
              type="vulnerable"
              input={vulnState.input}
              table={vulnState.table}
              result={vulnState.result}
              loading={vulnState.loading}
              queryExecuted={vulnState.queryExecuted}
              onInputChange={(v) => setVulnState((s) => ({ ...s, input: v }))}
              onTableChange={(t) => setVulnState((s) => ({ ...s, table: t }))}
              onSubmit={handleVulnSubmit}
            />
          </div>
          <div className="col-lg-6">
            <QueryPanel
              type="secure"
              input={secureState.input}
              table={secureState.table}
              result={secureState.result}
              loading={secureState.loading}
              queryExecuted={null}
              onInputChange={(v) => setSecureState((s) => ({ ...s, input: v }))}
              onTableChange={(t) => setSecureState((s) => ({ ...s, table: t }))}
              onSubmit={handleSecureSubmit}
            />
          </div>
        </div>

        <TestCases onRunVuln={handleRunVuln} onRunSecure={handleRunSecure} />

        <DatabaseSchema />
        <AttackTypes />
        <AboutSection />
      </Container>

      <ChatbotModal show={chatbotShow} onHide={() => setChatbotShow(false)} />
      <Footer />
    </>
  );
}

export default App;
