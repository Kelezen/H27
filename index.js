const ITEM_WIDTH = 200
const ITEM_HEIGHTS = 300
let currentSlide = 0
let paused = false

const imagesSrc = [
 'https://picsum.photos/id/237/200/300',
 'https://picsum.photos/id/238/200/300',
 'https://picsum.photos/id/239/200/300',
 'https://picsum.photos/id/231/200/300',
 'https://picsum.photos/id/232/200/300',
]

function createWindowElement(){
 const windowElement = document.createElement('div')
 windowElement.classList.add("rootElement")
 document.body.appendChild(windowElement)
 return windowElement
}

function createStripeOfImages(listOfImages, container){
 const moveContainer = document.createElement('div')
 moveContainer.classList.add('moveContainer')

 listOfImages.map(uri=>{
  const img = document.createElement('img')
  img.src = uri
  moveContainer.appendChild(img)
 })

 container.appendChild(moveContainer)
 return moveContainer
}

function createButtons(){
 const buttonNext = document.createElement('button')
 const buttonPrev = document.createElement('button')
 const buttonPause = document.createElement('button')

 buttonNext.innerText = "NEXT"
 buttonPrev.innerText = "PREV"
 buttonPause.innerText = "PLAY/PAUSE"

 document.body.appendChild(buttonPrev)
 document.body.appendChild(buttonPause)
 document.body.appendChild(buttonNext)

 return {buttonPrev,buttonNext,buttonPause}
}

const windowContainer1 = createWindowElement()
const stripeContainer = createStripeOfImages(imagesSrc,windowContainer1)
const buttons = createButtons()


function createIndicators(windowContainer,listOfSlides){

 listOfSlides.forEach((element,index)=>{

  let circle = document.createElement('div')
  circle.classList.add('circle')

  if(index === 0){
   circle.classList.add('circleActive')
  }

  circle.addEventListener('click',()=>{

   const circles = document.getElementsByClassName('circle')

   circles[currentSlide].classList.remove('circleActive')

   currentSlide = index

   stripeContainer.style.left = -currentSlide * ITEM_WIDTH + 'px'

   circles[currentSlide].classList.add('circleActive')

  })

  windowContainer.appendChild(circle)

 })

}

createIndicators(windowContainer1,imagesSrc)


function getSlideHandlers(numberOfImages, stripeContainer){

 const circlesList = document.getElementsByClassName('circle')

 function getNextSlide(){

  circlesList[currentSlide].classList.remove('circleActive')

  if(currentSlide + 1 < numberOfImages){
   ++currentSlide
  }else{
   currentSlide = 0
  }

  stripeContainer.style.left = -currentSlide * ITEM_WIDTH + 'px'

  circlesList[currentSlide].classList.add('circleActive')
 }

 function getPrevSlide(){

  circlesList[currentSlide].classList.remove('circleActive')

  if(currentSlide - 1 >= 0){
   --currentSlide
  }else{
   currentSlide = numberOfImages - 1
  }

  stripeContainer.style.left = -currentSlide * ITEM_WIDTH + 'px'

  circlesList[currentSlide].classList.add('circleActive')
 }

 function togglePause(){
  paused = !paused
 }

 return {getNextSlide,getPrevSlide,togglePause}

}

const handlers = getSlideHandlers(imagesSrc.length,stripeContainer)

buttons.buttonNext.addEventListener('click',handlers.getNextSlide)
buttons.buttonPrev.addEventListener('click',handlers.getPrevSlide)
buttons.buttonPause.addEventListener('click',handlers.togglePause)


document.addEventListener('keydown',(e)=>{

 if(e.code === 'ArrowRight'){
  handlers.getNextSlide()
 }

 if(e.code === 'ArrowLeft'){
  handlers.getPrevSlide()
 }

})


setInterval(()=>{
 if(!paused){
  handlers.getNextSlide()
 }
},3000)



/* SWIPE (touch + mouse) */

let startX = 0

stripeContainer.addEventListener('mousedown', e=>{
 startX = e.clientX
})

stripeContainer.addEventListener('mouseup', e=>{

 if(startX - e.clientX > 50){
  handlers.getNextSlide()
 }

 if(e.clientX - startX > 50){
  handlers.getPrevSlide()
 }

})

stripeContainer.addEventListener('touchstart', e=>{
 startX = e.touches[0].clientX
})

stripeContainer.addEventListener('touchend', e=>{

 let endX = e.changedTouches[0].clientX

 if(startX - endX > 50){
  handlers.getNextSlide()
 }

 if(endX - startX > 50){
  handlers.getPrevSlide()
 }

})