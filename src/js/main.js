$(function() {
  debugger
  let a = $('#scene').html()
  let b = document.getElementById('#scene')
  let parallaxInstance = new Parallax(b, {
    relativeInput: true
  })

  parallaxInstance.friction(0.2, 0.2)
})
