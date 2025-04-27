module.exports = {
    //...
    externals: {
      ['@solana/web3.js']: 'commonjs @solana/web3.js',
      ['@solana/spl-token']: 'commonjs @solana/spl-token'
    }
  };
  
  // next.config.js
  module.exports = {
    webpack: (config) => {
      // ...
      config.externals['@solana/web3.js'] = 'commonjs @solana/web3.js';
      config.externals['@solana/spl-token'] = 'commonjs @solana/spl-token';
      return config;
    }
  };