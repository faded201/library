let user = {
  xp: 0,
  abilities: []
};

export default function handler(req, res) {
  user.xp += 50;

  if (user.xp > 100 && !user.abilities.includes("Shadow Step")) {
    user.abilities.push("Shadow Step");
  }

  res.status(200).json(user);
}
