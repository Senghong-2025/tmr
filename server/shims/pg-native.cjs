module.exports = function PgNativeShim() {
  throw new Error("pg-native is not available in this runtime.");
};
