const { Router } = require('express')
var Jimp = require('jimp');

const router = Router()

router.get('/', (req, res)=>{
  try {
    res.render('index')
  } catch (err) {
    console.log(err)
  }

})

router.post('/', async (req, res)=>{
  try { 
    //creating file path
    let imgRaw = 'public/raw/rasm.jpg'; //a 626px x 626px backgroound image

    let imgActive = 'public/active/rasm.jpg';
    let imgExported = `public/export/image.jpg`;

    let textData = {
      text: `${req.body.name}`.toUpperCase(), //the text to be rendered on the image
      maxWidth: 500, //image width - 10px margin left - 10px margin right
      maxHeight: 100, //text height + margin
      placementX: 0.10, // on the x axis
      placementY: 215 //bottom of the image
    };

    const clone = await Jimp.read(imgRaw)
    await clone.clone().write(imgActive)

    //read cloned (active) image
    const active = await Jimp.read(imgActive)
    
    //load font	
    const font = await Jimp.loadFont('./public/fonts/aAwalRamadhan.ttf.fnt')

    const image = await active.print(font, textData.placementX, textData.placementY, {
      text: textData.text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    }, textData.maxWidth)

    await image.quality(100).write(imgExported)

    res.redirect('/success')
  } catch (err) {
    console.log(err)
  }
})

router.get('/success', (req, res)=>{
  try {
    res.render('success')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router