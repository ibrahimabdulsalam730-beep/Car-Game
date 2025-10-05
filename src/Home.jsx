import React, { useState } from 'react';
import { postReview } from './api';

const Home = ({ onStart }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [sending, setSending] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      setSending(true);
      const res = await postReview(reviewText.trim());
      if (!res.ok) throw new Error('Server error');
      setReviewText('');
      // Keep UX minimal: user doesn't see reviews list
      alert('Thank you — your review was sent.');
    } catch (err) {
      console.error('Failed to send review', err);
      alert('Failed to send review. Check console or try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("/images/bg_image.png")' }}>
      <div className="bg-white/90 rounded-xl shadow-xl p-8 max-w-2xl w-11/12 text-center" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <h1 className="text-4xl font-bold mb-4">Car game</h1>

        <p className="text-sm text-gray-700 mb-6">Welcome — drive carefully and try to get the highest score!</p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Start
          </button>

          <button
            onClick={() => { setShowAbout(prev => !prev); setShowContact(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            About
          </button>

          <button
            onClick={() => { setShowContact(prev => !prev); setShowAbout(false); }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Contact
          </button>
        </div>

        {showAbout && (
          <div className="mb-6 text-left bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">About this game</h2>
            <p className="text-sm text-gray-700">This is a lightweight browser car dodging game built with React. Use the on-screen controls or arrow keys to move. Avoid enemy cars and try to get the highest score.</p>
          </div>
        )}

        {showContact && (
          <form onSubmit={submitReview} className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share your review / improvement ideas</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 mb-2"
              rows={4}
              placeholder="What did you like? What should be improved?"
            />
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
              <div className="text-sm text-gray-600">Reviews sent to the server (not displayed here).</div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Home;
