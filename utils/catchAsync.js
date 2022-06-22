module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
    //powinno byc .catch((e) => {next(e)})
  };
};
