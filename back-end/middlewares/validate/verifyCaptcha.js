import fetch from 'node-fetch';

export async function verifyCaptcha (req, res, next) {
  const { turnstileToken } = req.body;
  
  if (!turnstileToken) {
    return res.status(400).json({ message: "CAPTCHA token missing" });
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: turnstileToken
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      return res.status(403).json({ message: "CAPTCHA verification failed" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "CAPTCHA verification service unavailable" });
  }
};