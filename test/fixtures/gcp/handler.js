// eslint-disable-next-line import/prefer-default-export
export const hello = async (event) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "Go Serverless v2.0! Your function executed successfully!",
      input: event,
    },
    null,
    2,
  ),
});
