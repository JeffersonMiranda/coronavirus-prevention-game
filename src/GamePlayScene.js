import Phaser from 'phaser'

export default class GamePlayScene extends Phaser.Scene {

  constructor (config) {
    super(config)
  }

  create() {
    this.hitSound = this.sound.add('hitSound');
    this.gameOverSound = this.sound.add('gameOverSound')
    this.backgroundSong = this.sound.add('backgroundSong');
    this.backgroundSong.setVolume(0.4)
    this.backgroundSong.play({
      loop: -1
    })

    this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'gameplayBackground')
    this.background.setScale(3.4)

    this.basket = this.add.image(200, 150, 'basket')
    this.basket.setScale(0.5)

    this.scoreText = this.add.text(this.basket.x + 140, 120, '0', { fontSize: '80px', fill: '#fff' });

    this.lives = 3
    this.livesBoard = this.physics.add.staticGroup()

    for (let index = 1; index <= 3; index++) {
      this.livesBoard.create(window.innerWidth - (70 * index), 150 , 'heart')
    }
    
    const newItem = () => this.createItem(this)

    this.itemsCreation = this.time.addEvent({
      delay: 2000,
      callback: () => {
        newItem()
      },
      repeat: -1
    })

    const currentScene = this

    this.time.addEvent({
      delay: 4000,
      callback: () => {
        const currentDelay = currentScene.itemsCreation.delay
        const newDelay = currentDelay - (currentDelay * 0.10)

        if (newDelay > 400) {
          console.log(newDelay)
          currentScene.itemsCreation.delay = currentDelay - (currentDelay * 0.10) 
        }
      },
      repeat: -1
    })
  }
 
  createItem(scene) {
    const items = ['mask', 'alcool', 'gloves', 'soap', 'virus']
    const randomItem = items[Math.floor(Math.random() * items .length)];
    const randomItemHeightFall = Math.random() * (((window.innerHeight / 2 - 400))  - window.innerHeight / 2 ) + window.innerHeight / 2; 
  
    const origins = [
      { direction: 1, origin: -50 },
      { direction: this.getRandomNumberSignal(), origin: window.innerWidth / 2 },
      { direction: -1, origin:  window.innerWidth + 50 }
    ]
    
    const side = origins[Math.floor(Math.random() * origins .length)]

    var itemSprite = scene.physics.add.image(side.origin, window.innerHeight + 100, randomItem)
                                       .setScale(0.5)
                                       .setInteractive()

    setTimeout(() => {
      itemSprite.destroy()
    }, 10000)

    const getVelocity = () => side.origin === window.innerWidth / 2 ? 
                              this.getRandomFromRange(250, 220) : 
                              this.getRandomFromRange(500, 450)
  
    itemSprite.setVelocity(getVelocity() * side.direction);

    itemSprite.isVirus = randomItem === 'virus'

    const itemTween = scene.tweens.add({
      targets: itemSprite,
      y: randomItemHeightFall,
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      rotation: scene.getRandomNumberSignal(),
      onComplete: () => {
        if (!itemSprite.isVirus && scene.lives) {
          scene.livesBoard.getChildren()[scene.lives - 1].alpha = 0
          scene.lives--
  
          if (!scene.lives) { 
            scene.gameOverFallTween(scene, [scene.basket, scene.scoreText, scene.livesBoard])
          }
        }
      }
    });

    itemSprite.on('pointerdown', () => {
  
      if (itemSprite.isVirus) {
        scene.cleanLivesBoard(scene)
        
        if (scene.lives) { 
          scene.lives = 0
          scene.itemGoToBasket(itemSprite, () => {
            scene.gameOverFallTween(scene, [scene.basket, scene.scoreText, scene.livesBoard])
          })
        }
      } else if (scene.lives) {
        const score = scene.scoreText
        const currentScore = score.text

        scene.hitSound.play()
        itemTween.stop()
        scene.itemGoToBasket(itemSprite)
        score.setText(parseInt(currentScore) + 10)
      }
    });
  } 
  
  getRandomNumberSignal() {
    return (Math.random() - 0.5) * 2
  }

  getRandomFromRange(min, max) {
    return Math.random() * (max - min) + min
  }

  gameOver(scene) {
    scene.backgroundSong.stop()
    scene.gameOverSound.play()

    scene.gameOverSound.once('complete', () => {
      scene.scene.start('gameOver', {
        points: scene.scoreText.text
      })
    })
  }

  gameOverFallTween(scene, sprites) {
    scene.itemsCreation.remove()

    return scene.tweens.add({
      targets: sprites,
      y: window.innerHeight + 100,
      rotation: 0.75,
      duration: 1500,
      ease: 'Sine',
      onStart: () => {
        scene.gameOver(scene)
      }
    });
  }

  itemGoToBasket(itemSprite, additionalOnComplete) {
    return this.tweens.add({
      targets: itemSprite,
      y: 350,
      x: 200,
      duration: 100,
      ease: 'Sine',
      onComplete: () => {
        itemSprite.alpha = 0
        if (additionalOnComplete){
          additionalOnComplete()
        }
      }
    });
  }

  cleanLivesBoard(scene) {
    for (let index = scene.lives - 1; index >= 0; index--) {
      scene.livesBoard.getChildren()[index].alpha = 0
    }
  }
}