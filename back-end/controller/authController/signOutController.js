export function signOut(req, res) {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({ message: "Sign-out successful" });
}
