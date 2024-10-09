export function signOut(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ message: "Sign-out successful" });
}
