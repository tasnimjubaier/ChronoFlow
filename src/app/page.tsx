import ChronoFlow from '@/components/ChronoFlow';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ChronoFlow</h1>
        <p className="text-gray-600 mb-8">Streamline your time, amplify your productivity</p>
        <ChronoFlow />
      </div>
    </main>
  );
}