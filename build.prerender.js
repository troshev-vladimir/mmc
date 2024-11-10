// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const PuppeteerRenderer = PrerenderSPAPlugin.PuppeteerRenderer
// eslint-disable-next-line @typescript-eslint/no-var-requires
const staticRoutes = require('./prereder-static-routes')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')

const itemsPerpage = 20 // Это не менять. Должно соотвествовать кол-ву элементов на странице

async function getDynamicRoutes(routes, stockBrands) {
  const promices = stockBrands.map(async (brand) => {
    const { data } = await axios.get(
      'https://api.mmcflash.ru:8888/api/StockFile/Query',
      {
        params: {
          search: brand,
        },
      }
    )
    

    routes.push('/stock/' + brand)

    const stockAmount = data.success.itemsCount
    const pagesAmount = Math.ceil(stockAmount / itemsPerpage)

    // if (brand === 'Dongfeng') {
      for (let i = 2; i <= pagesAmount; i++) {
        routes.push('/stock/' + brand + '/' + i)
      }
    // }
  })

  await Promise.all(promices)
}

async function getNewsRoutes(routes, currentLang) {
  const { data: news } = await axios.post(
    'https://api.mmcflash.ru:8888/api/News/List',
    {
      "newsType": [
        "Regular",
        "NewFirmware",
        "Article"
      ],
      "includeHtml": false,
      "lang": currentLang,
      "isDeleted": false,
      "skip": 0,
      "take": 100000
    }, 
     {
      headers: {
        "Content-Type": "application/json",
        credentials: "include"
      }
     }
  ) 

  console.log('news', news.success.items.length);

  return news.success.items.map(el => '/news/' + el.slug)
  // const slugs = news.success?.items.filter(el => {
  //   if (el.isDeleted) return false
  //   else return true
  // }).map(el => el.slug)

  // const unique = Array.from(new Set(slugs))
  // unique.forEach(el => {
  //   routes.push('/news/'+el)
  // })
}

const removeSlashes = (str) => {
  return str.replaceAll(' ', '_')
}

async function getEcuRoutes(routes, currentLang) {
  const { data: ecus } = await axios.post(
    'https://api.mmcflash.ru:8888/api/Vehicle/GetVehicle',
    {
      "skip": 0,
      "take": 100,
      "searchPattern": "",
      "brand": ""
    },
    {
      headers: {
        "Content-Type": "application/json",
        credentials: "include"
      }
    }
  ) 

  console.log('ecus', ecus.success.items.length);
  const urls = []
  const pricesUrls = ecus.success.items.map(el => encodeURI('/prices/' + `${removeSlashes(el.type.name)}/${removeSlashes(el.brand.name)}/${removeSlashes(el.model.name)}/${removeSlashes(el.engine.name)}/${removeSlashes(el.ecu.name)}`))
  const pricesUrlsWithoutEcu = ecus.success.items.map(el => encodeURI('/prices/' + `${removeSlashes(el.type.name)}/${removeSlashes(el.brand.name)}`))
  const ordersUrls = ecus.success.items.map(el => encodeURI('/order/' + `${removeSlashes(el.type.name)}/${removeSlashes(el.brand.name)}/${removeSlashes(el.model.name)}/${removeSlashes(el.engine.name)}/${removeSlashes(el.ecu.name)}`))
  pricesUrls.push(...pricesUrlsWithoutEcu)
  return urls.concat(pricesUrls, ordersUrls)
}

module.exports = (api, options) => {
  api.registerCommand('build:prerender', async (args) => {
    let routes = staticRoutes.routes || []
    const currentLang = args.lang || 'en'

    if (!args['without-stock']) {
      const { data } = await axios.get(
        'https://api.mmcflash.ru:8888/api/StockFile/GetBrandFilter',
        {
          params: {
            typeName: '',
            brandName: '',
            modelName: '',
            engineName: '',
            ecuName: '',
          },
        }
      )
      const stockBrands = data.success

      await getDynamicRoutes(routes, stockBrands)
    }

    const news = await getNewsRoutes(routes, currentLang)
    const ecus = await getEcuRoutes(routes, currentLang)

    
    routes = routes.concat(news)
    routes = routes.concat(ecus)
    routes = Array.from(new Set(routes))
    console.log(routes);
    
    routes = routes.map((el) => el + '?initial_lang=' + currentLang)
    console.log('Routes amount: ', routes.length)
    console.log('Current lang is: ', currentLang)
    console.log('Is only essentials: ', !!args['without-stock'])
    api.chainWebpack((config) => {
      config.plugin('prerender').use(PrerenderSPAPlugin, [
        {
          staticDir: path.join(__dirname, 'dist'),
          outputDir: path.join(__dirname, 'prerendered'),
          routes,

          renderer: new PuppeteerRenderer({
            headless: true,
            renderAfterDocumentEvent: 'app-prerender',
            maxConcurrentRoutes: 10,
          }),
        },
      ])
    })
    fs.rmSync(path.join(__dirname, 'prerendered'), {
      recursive: true,
      force: true,
    })
    await api.service.run('build')
  })
}

module.exports.defaultModes = {
  'build:prerender': 'production',
}
