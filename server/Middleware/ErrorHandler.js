exports.handleError = (err, req, res, next) => {
  err.message ||= "some internal server error occurd";
  err.status ||= 500;
  return res.status(err.status).json({
    status: false,
    message: err.message,
    error: err,
  });
};
