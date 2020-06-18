module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/knowledge-map/'
    : './',
  productionSourceMap: process.env.NODE_ENV !== 'production'
};
