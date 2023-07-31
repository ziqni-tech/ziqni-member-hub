const splitCamelCaseToWords = (str) => {
  const regex = /(?<=[a-z])(?=[A-Z])|(?<=[a-zA-Z])(?=\d)/g;

  return str.split(regex).join(' ');
};

export default splitCamelCaseToWords;