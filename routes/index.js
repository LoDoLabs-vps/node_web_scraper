var express = require('express');
var router = express.Router();
const webScrapingController = require('../controllers/webScrapingController.js')
const webScrapingControllerClass = new webScrapingController
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scraper', (req, res, next) => {
  res.json(webScrapingControllerClass.scrapeList())
})

router.get('/detail', (req, res, next) => {
  res.json(webScrapingControllerClass.scrapeDetail())
})

module.exports = router;
