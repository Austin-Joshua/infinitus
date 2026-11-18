import { notFound } from 'next/navigation';
import TestErrorClient from './TestErrorClient';

export default function TestErrorPage() {
  if (process.env.E2E !== '1') {
    notFound();
  }

  return <TestErrorClient />;
}
