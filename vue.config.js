module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : './',
  productionSourceMap: process.env.NODE_ENV !== 'production'
};
