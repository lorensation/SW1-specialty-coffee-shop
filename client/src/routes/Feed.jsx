import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const [news, setNews] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const [newOpinion, setNewOpinion] = useState({ rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchOpinions();
    
    // Set up realtime subscriptions
    const newsChannel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          if (payload.new.published) {
            setNews((current) => [payload.new, ...current]);
            addToast('New article published!', 'info');
          }
        }
      )
      .subscribe();

    const opinionsChannel = supabase
      .channel('opinions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opinions',
        },
        (payload) => {
          if (payload.new.approved) {
            fetchOpinions(); // Refetch to get user info
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newsChannel);
      supabase.removeChannel(opinionsChannel);
    };
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchOpinions = async () => {
    try {
      const { data, error } = await supabase
        .from('opinions')
        .select(`
          *,
          profiles (name)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpinions(data || []);
    } catch (error) {
      console.error('Error fetching opinions:', error);
    }
  };

  const handleSubmitOpinion = async (e) => {
    e.preventDefault();

    if (!user) {
      addToast('Please sign in to share your opinion', 'error');
      return;
    }

    if (!newOpinion.text.trim()) {
      addToast('Please write your opinion', 'error');
      return;
    }

    if (newOpinion.text.length > 500) {
      addToast('Opinion must be 500 characters or less', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('opinions')
        .insert({
          user_id: user.id,
          rating: newOpinion.rating,
          text: newOpinion.text.trim(),
          approved: false, // Requires admin approval
        });

      if (error) throw error;

      addToast('Opinion submitted! It will appear after approval.', 'success');
      setNewOpinion({ rating: 5, text: '' });
    } catch (error) {
      console.error('Error submitting opinion:', error);
      addToast('Error submitting opinion', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Community Feed</h1>
            <p className="text-lg text-muted-foreground">
              Latest news and opinions from our coffee community
            </p>
          </div>

          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="opinions">Opinions</TabsTrigger>
            </TabsList>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-6">
              {news.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No news articles yet
                  </CardContent>
                </Card>
              ) : (
                news.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {article.body}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Opinions Tab */}
            <TabsContent value="opinions" className="space-y-6">
              {/* Submit Opinion Form */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Opinion</CardTitle>
                    <CardDescription>
                      Tell us about your Royal Coffee experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitOpinion} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rating
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setNewOpinion({ ...newOpinion, rating })}
                              className="text-2xl focus:outline-none transition-smooth hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  rating <= newOpinion.rating
                                    ? 'fill-accent text-accent'
                                    : 'text-muted'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={newOpinion.text}
                          onChange={(e) =>
                            setNewOpinion({ ...newOpinion, text: e.target.value })
                          }
                          rows={4}
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {newOpinion.text.length}/500 characters
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                      >
                        {submitting ? 'Submitting...' : 'Submit Opinion'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Opinions List */}
              <div className="space-y-4">
                {opinions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No opinions yet. Be the first to share!
                    </CardContent>
                  </Card>
                ) : (
                  opinions.map((opinion) => (
                    <Card key={opinion.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">
                              {opinion.profiles?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(opinion.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < opinion.rating
                                    ? 'fill-accent text-accent'
                                    : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{opinion.text}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Feed;
