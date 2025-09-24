import { supabase } from '@/lib/supabase/client';

export default async function TestDB() {
  try {
    const { data: pages, error } = await supabase
      .from('landing_pages')
      .select('*')
      .limit(5);

    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Database Test</h1>
        <div className="mb-4">
          <strong>Error:</strong> {error ? JSON.stringify(error) : 'None'}
        </div>
        <div className="mb-4">
          <strong>Pages found:</strong> {pages?.length || 0}
        </div>
        <div>
          <strong>Data:</strong>
          <pre className="bg-gray-800 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(pages, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Database Test - Error</h1>
        <pre className="bg-red-900 p-4 rounded">{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}
