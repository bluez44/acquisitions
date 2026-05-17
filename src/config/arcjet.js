import arcjet, { detectBot, shield, tokenBucket } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_API_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    // tokenBucket({
    //   mode: 'LIVE',
    //   refillRate: 5,
    //   interval: 10,
    //   capacity: 10,
    // }),
  ],
});

export default aj;
