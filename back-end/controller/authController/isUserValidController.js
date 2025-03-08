export function isUserValid(req, res) {
  res.status(200).json(req.user);
}
