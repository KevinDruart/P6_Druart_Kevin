const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      //retourne l'userId
      req.userIdToken = userId;
      //passe au middleware suivant
      next();
    }
  } catch {
    res.status(401).json({
      error:" Vous n'avez pas les autorisation: token invalide, expiré, ou vous n'etes pas proprietaire de cet sauce."
    });
  }
};