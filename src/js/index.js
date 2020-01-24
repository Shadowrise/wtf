import $ from 'jquery'
import bootstrap from 'bootstrap'
import Parallax from 'parallax-js'

$(function() {
  // let a = $('#scene').html()
  // let b = document.getElementById('#scene')
  // let parallaxInstance = new Parallax(b, {
  //   relativeInput: true
  // })
  // parallaxInstance.friction(0.2, 0.2)
  $('#test').click(e => {
    e.preventDefaul()
    console.log('submitted')
  })
})

import '.././scss/style.scss'
