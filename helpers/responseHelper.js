const responseHelper = (res, status, data, message) => {
  if (status === 500) {
    return res.status(500).json({
      status: 'Error',
      statusCode: 500,
      message,
    });
  }
  if (status === 404) {
    return res.status(404).json({
      status: 'Error',
      statusCode: 404,
      message: 'Api Not Found',
    });
  }
  if (status === 400) {
    return res.status(400).json({
      status: 'Error',
      statusCode: 400,
      message,
    });
  }
  return res.status(200).json({
    status: 'Success',
    statusCode: 200,
    data,
    message,
  });
};

export default responseHelper;
