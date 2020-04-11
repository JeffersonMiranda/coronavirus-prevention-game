import Phaser from "phaser"
import background from "./assets/images/background.png"
import basketImg from "./assets/images/basket.png"
import logoImg from "./assets/images/mask.png"
import alcoolImg from "./assets/images/alcool.png"
import glovesImg from "./assets/images/gloves.png"
import soapImg from "./assets/images/soap.png"
import virusImg from "./assets/images/virus.png"
import backgroundSong from "./assets/audio/background.wav"
import hitSound from "./assets/audio/hit.wav"
import gameOverSound from "./assets/audio/gameover.mp3"

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
  this.load.audio('backgroundSong', backgroundSong);
  this.load.audio('hitSound', hitSound);
  this.load.audio('gameOverSound', gameOverSound);
}

function create() {
  this.hitSound = this.sound.add('hitSound');
  this.gameOverSound = this.sound.add('gameOverSound')
  this.backgroundSong = this.sound.add('backgroundSong');
  this.backgroundSong.play({
    loop: -1
  })

  this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
  this.background.setScale(3)

  this.basket = this.add.image(200, 200, 'basket')
  this.basket.setScale(0.5)

  this.scoreText = this.add.text(this.basket.x + 140, 165, '0', { fontSize: '80px', fill: '#fff' });

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
      // debugger
      // this.scene.itemsCreation = newItem()
      // currentScene.itemsCreation.remove()  //newItem()
      const currentDelay = currentScene.itemsCreation.delay
      const newDelay = currentDelay - (currentDelay * 0.25)

      if (newDelay > 250) {
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
                                     .setScale(0.5)
                                     .setInteractive()

  itemSprite.isVirus = randomItem === 'virus'                                    
  
  const randomVelocity = Math.random() * (250 - 220) + 220;

  itemSprite.setVelocity(randomVelocity * getRandomNumberSignal());


  const itemTween = scene.tweens.add({
    targets: itemSprite,
    y: window.innerHeight / 2,
    duration: 800,
    ease: 'Power2',
    yoyo: true,
    rotation: getRandomNumberSignal()
    // loop: -1
  });
  
  itemSprite.on('pointerdown', () => {

    if (itemSprite.isVirus) {
      scene.backgroundSong.stop()
      scene.gameOverSound.play()
      alert('GAME OVER')
      scene.scene.restart()
    } else {
      const score = scene.scoreText
      const currentScore = score.text
      scene.hitSound.play()

      itemTween.stop()
      // debugger
      // scene.physics.moveToObject(itemSprite, this.scene.basket, 100, 50)
      const newItemTween = scene.tweens.add({
        targets: itemSprite,
        y: 350, //window.innerHeight / 2,
        x: 200,
        duration: 200,
        ease: 'Sine',
        onComplete: () => {
          itemSprite.alpha = 0
        }
      });

      score.setText(parseInt(currentScore) + 10)
    }
  });
} 

function getRandomNumberSignal() {
  return (Math.random() - 0.5) * 2
}