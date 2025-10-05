// Minimal API helper for posting reviews to the Python backend.
export async function postReview(text) {
  try {
    const resp = await fetch('http://127.0.0.1:5000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: text })
    });
    return resp;
  } catch (err) {
    console.error('postReview error', err);
    throw err;
  }
}

export default { postReview };
