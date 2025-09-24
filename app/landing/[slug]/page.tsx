import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface LandingPageProps {
  params: {
    slug: string;
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  
  console.log('=== DYNAMIC ROUTE DEBUG ===');
  console.log('Fetching landing page for slug:', slug);
  console.log('Supabase client:', !!supabase);

  try {
    // Fetch the landing page from database
    const { data: page, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('Page data:', page);
    console.log('Error:', error);

    if (error) {
      console.error('Database error:', error);
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-red-400">Database Error</h1>
            <p className="text-xl text-white/70">Error: {error.message}</p>
            <p className="text-sm text-white/50 mt-4">Slug: {slug}</p>
          </div>
        </div>
      );
    }

    if (!page) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-yellow-400">Page Not Found</h1>
            <p className="text-xl text-white/70">No landing page found for: {slug}</p>
            <p className="text-sm text-white/50 mt-4">Check the admin panel to see available pages</p>
          </div>
        </div>
      );
    }

    // Update view count
    try {
      await supabase
        .from('landing_pages')
        .update({ 
          view_count: (page.view_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id);
    } catch (trackingError) {
      console.log('Tracking error (non-critical):', trackingError);
    }

    // Render the actual landing page
    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`absolute rounded-full border border-purple-400/20 ${
                  i === 0 ? 'w-32 h-32 animate-pulse' :
                  i === 1 ? 'w-64 h-64 animate-pulse delay-75' :
                  'w-96 h-96 animate-pulse delay-150'
                }`}
                style={{
                  boxShadow: `inset 0 0 ${(i + 1) * 20}px rgba(147, 51, 234, 0.1)`,
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
              {page.content?.title || page.title}
            </h1>

            {/* Subtitle */}
            {page.content?.subtitle && (
              <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                {page.content.subtitle}
              </p>
            )}

            {/* Description */}
            {page.content?.description && (
              <p className="text-base text-white/60 mb-8 max-w-3xl mx-auto">
                {page.content.description}
              </p>
            )}

            {/* Contact Information */}
            {page.content?.contact && (
              <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="space-y-2 text-sm text-white/70">
                  {page.content.contact.email && (
                    <p>📧 {page.content.contact.email}</p>
                  )}
                  {page.content.contact.phone && (
                    <p>📞 {page.content.contact.phone}</p>
                  )}
                  {page.content.contact.website && (
                    <p>🌐 <a href={page.content.contact.website} className="text-purple-300 hover:text-purple-200" target="_blank" rel="noopener noreferrer">{page.content.contact.website}</a></p>
                  )}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {page.content?.social && (
              <div className="flex justify-center gap-4">
                {page.content.social.facebook && (
                  <a
                    href={page.content.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 rounded-lg transition-colors duration-200"
                  >
                    Facebook
                  </a>
                )}
                {page.content.social.instagram && (
                  <a
                    href={page.content.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-400/30 text-pink-200 rounded-lg transition-colors duration-200"
                  >
                    Instagram
                  </a>
                )}
                {page.content.social.linkedin && (
                  <a
                    href={page.content.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-500/30 text-blue-300 rounded-lg transition-colors duration-200"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 border-t border-gray-600/30 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/60 text-sm">
              Powered by <span className="text-purple-300">Cosmic Portals</span>
            </p>
            <p className="text-white/40 text-xs mt-2">
              View Count: {page.view_count || 0} | Last Updated: {new Date(page.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-400">Unexpected Error</h1>
          <p className="text-xl text-white/70">Something went wrong</p>
          <p className="text-sm text-white/50 mt-4">Error: {String(err)}</p>
        </div>
      </div>
    );
  }
}