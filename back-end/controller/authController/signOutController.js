export function signOut(req, res) {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    signed: true,
  });
  res.status(200).json({ message: "Sign-out successful" });
}
