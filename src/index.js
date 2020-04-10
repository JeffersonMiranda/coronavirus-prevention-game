import Phaser from "phaser"
import background from "./assets/images/background.png"
import basketImg from "./assets/images/basket.png"
import logoImg from "./assets/images/mask.png"
import alcoolImg from "./assets/images/alcool.png"
import glovesImg from "./assets/images/gloves.png"
import soapImg from "./assets/images/soap.png"
import virusImg from "./assets/images/virus.png"

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', background)
  this.load.image('mask', logoImg)
  this.load.image('alcool', alcoolImg)
  this.load.image('gloves', glovesImg)
  this.load.image('soap', soapImg)
  this.load.image('virus', virusImg)
  this.load.image('basket', basketImg)
}

function create() {
  const background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
  background.setScale(3)

  const basket = this.add.image(200, 200, 'basket')
  basket.setScale(0.5)

  this.scoreText = this.add.text(basket.x + 140, 165, '0', { fontSize: '80px', fill: '#fff' });

  // this.scoreText.setText(10)
  
  const newItem = () => createItem(this)
// debugger
  // this.time.delayedCall(1, newItem, null, this)

  this.itemsCreation = this.time.addEvent({
    delay: 2000,
    callback: () => {
      // let newLevel = ++levelClass.currentLevel
      // levelClass.checkLevel()
      // this.itemsCreation = setInterval(newItem, 2500)
      // console.log('level up')
      // debugger
      // this.scene.itemsCreation = newItem()
      newItem()
    },
    repeat: -1
  })

  const currentScene = this

  this.time.addEvent({
    delay: 15000,
    callback: () => {
      // let newLevel = ++levelClass.currentLevel
      // levelClass.checkLevel()
      // this.itemsCreation = setInterval(newItem, 2500)
      console.log('level up')
      debugger
      // this.scene.itemsCreation = newItem()
      // currentScene.itemsCreation.remove()  //newItem()
      const currentDelay = currentScene.itemsCreation.delay
      const newDelay = currentDelay - (currentDelay * 0.25)

      if (newDelay > 400) {
        currentScene.itemsCreation.delay = currentDelay - (currentDelay * 0.25) 
      }

      console.log(currentScene.itemsCreation.delay)


    },
    repeat: -1
  })


}

function update() {
  
}

function createItem(scene) {
  // console.log('new item')
  const items = ['mask', 'alcool', 'gloves', 'soap', 'virus']

  const randomItem = items[Math.floor(Math.random() * items .length)];

// console.log(randomItem)
  var itemSprite = scene.physics.add.image(window.innerWidth / 2, window.innerHeight, randomItem)
                                   .setScale(0.5).setInteractive()
  
  const randomVelocity = Math.random() * (250 - 220) + 220;

  itemSprite.setVelocity(randomVelocity * getNumberSignal());
  
  itemSprite.on('pointerdown', function(){
    const score = this.scene.scoreText
    const currentScore = score.text

    score.setText(parseInt(currentScore) + 10)
  });

  scene.tweens.add({
    targets: itemSprite,
    y: window.innerHeight / 2,
    duration: 1000,
    ease: "Power2",
    yoyo: true,
    rotation: getNumberSignal()
    // loop: -1
  });
} 

function getNumberSignal() {
  return (Math.random() - 0.5) * 2
}