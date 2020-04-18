const express = require('express'),
  path = require('path'),
  app = express(),

const axios = require('axios');


const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
let sitemap
  function slugify(string="") {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace((p, c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}



app.get('/sitemap.xml', function(req, res) {
  
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
 

  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap)
    return
  }
 
  try {
   
    const smStream = new SitemapStream({ hostname: '<DOMAIN_NAME>' })
    const pipeline = smStream.pipe(createGzip())

  //  AXIOS CHAINING
    axios.get('...').then(res => {
      axios.get('...').then(res => {
        axios.get('...').then(res => {
          // Your code here
          //  for(let item of data){
          //     smStream.write({ url: `URL`,  changefreq: 'daily', priority: 0.3 })
          //   }
      
          smStream.end()

      }).catch(error => {
            console.log(error);
      })
         

      }).catch(error => {
            console.log(error);
      })
    }).catch(error => {
      console.log(error);
    })

     

    // pipe your entries or directly write them.
      
    smStream.write({ url: `/page-one`,  changefreq: 'daily', priority: 0.3 })
 
    // cache the response
    streamToPromise(pipeline).then(sm => sitemap = sm)
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {throw e})
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})



app.use(express.static(path.join(__dirname, 'build')));

app.use(
  require('prerender-node')
    .set('prerenderServiceUrl', 'https://service.prerender.io/')
    .set('prerenderToken', '<PRERENDER_TOKEN>')
    .set('protocol', 'https')
);

app.get('/knockknock', (req, res) => {
  return res.status(200).send('Who is there?');
});



app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592800');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



app.get('*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592800');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT || 8080);
// eslint-disable-next-line no-console
console.log('Listening');
