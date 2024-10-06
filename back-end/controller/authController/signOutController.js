export function signOut(req, res) {
  res.cookie(process.env.COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0,
  });

  res.status(200).json({ message: "Sign-out successful" });
}
