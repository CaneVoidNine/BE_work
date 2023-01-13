export const errorHandler = (err, req, res, next) => {
  err
    ? res.status(err.status).send({ message: err.message })
    : res.status(500).send({ message: "Something went wrong!" });
};
