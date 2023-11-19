module.exports = function (api) {
  const isTest = api.env("test");

  // Babel configuration for testing environment
  if (isTest) {
    return {
      // Your Babel configurations for testing go here
      presets: ["@babel/preset-env", "@babel/preset-react"],
    };
  }

  // Babel configuration for other environments (e.g., production, development)
  return {
    // Your Babel configurations for other environments go here
    presets: ["next/babel"],
  };
};
