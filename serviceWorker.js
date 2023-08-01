var GHPATH = '/DuoTone';
var APP_PREFIX = 'duotonepwa_';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_00';

// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/background.jpg`,
  `${GHPATH}/duotone.js`,
  `${GHPATH}/duotone.svg`,
  `${GHPATH}/index.html`,
  `${GHPATH}/style.css`,
  `${GHPATH}/script.js`,
  `${GHPATH}/lockscreen.png`,
  `${GHPATH}/manifest.json`
]