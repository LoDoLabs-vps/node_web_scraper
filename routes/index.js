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
router.get('/allPages', (req, res, next) => {
  // res.json(webScrapingControllerClass.getAllPageLinks())
  webScrapingControllerClass.getAllPageLinks().then(data => res.json(data))
})

module.exports = router;
