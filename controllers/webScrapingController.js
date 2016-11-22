'use strict'
const cheerio = require('cheerio')
const requestPromise = require('request-promise')
const fs = require('fs')

module.exports = class webScrapingController {
  constructor() {}
  scrapePage(url) {
    var options = {
      uri: url,
      transform: function(body) {
        return cheerio.load(body);
      }
    }
    return requestPromise(options)
  }

  scrapePostings() {
    this.scrapePage('https://lowendbox.com/tag/denver/').then($ => {
      return $('body.div.wrap')
    })
  }
  
  getDetailUrlPosts($){
    var resultArray = []
    $(".type-post").each(function(i, elem) {
      resultArray.push({
        title: $('a', this).text(),
        url: $('a', this).attr('href')
      })
    })
    return resultArray
  }

  scrapeList() {
    let $ = cheerio.load(fs.readFileSync('denver_low_end_box.html'))

    var resultArray = []

    $(".type-post").each(function(i, elem) {
      resultArray.push({
        title: $('a', this).text(),
        url: $('a', this).attr('href')
      })
    })

    return resultArray
  }

  scrapeDetail($) {
    // let $ = cheerio.load(fs.readFileSync('box_detail.html'))
    let tags = []
    let paragraphs = []
    let title = $('.post .storytitle a').text()

    let table = $(".post .storycontent table").map(function(i, v) {
      var $td = $('td ul', this);
      var $tdTitle = $('td strong')
      var optionObject = {}
      optionObject[$tdTitle.eq(0).text()] = $td.eq(0).text().split("\n")
      optionObject[$tdTitle.eq(1).text()] = $td.eq(1).text().split("\n")
      optionObject[$tdTitle.eq(2).text()] = $td.eq(2).text().split("\n")
      return optionObject
    }).get();

    // scrape tags
    $('.post .meta a').each(function(i, elem) {
      tags.push($(this).text())
    })

    // scrape pagragraphs
    $('.post .storycontent p').each(function(i, elem){
      paragraphs.push($(this).text())
    })

    //title
    

    var boxObject = {
      title,
      tags,
      models_vailable: table,
      paragraphs
    }
    return boxObject
  }

  getAllPageLinks() {
    var promiseArr = []
    for(let i = 1; i < 4; i++){
      let url = "https://lowendbox.com/tag/denver/page/" + i + "/"
      return this.scrapePage(url).then(page => {
        var pageDataArr = this.getDetailUrlPosts(page)
        var pageDataPromiseArr = pageDataArr.map(i => {
          return this.scrapePage(i.url).then($ => this.scrapeDetail($))
        })
        return Promise.all(pageDataPromiseArr)
      })
    }
  }
}
