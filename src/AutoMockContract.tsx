import { useEffect } from 'react';
import { useConnect } from 'wagmi';

export function AutoMockConnect() {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    const mock = connectors.find(c => c.id === 'mock');
    if (mock) {
      connect({ connector: mock });
    }
  }, [connect, connectors]);

  return null;
}