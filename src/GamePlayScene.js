import Phaser from 'phaser'

export default class GamePlayScene extends Phaser.Scene {

  constructor (config) {
      super(config)
  }

  create() {
    this.hitSound = this.sound.add('hitSound');
    this.gameOverSound = this.sound.add('gameOverSound')
    this.backgroundSong = this.sound.add('backgroundSong');
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
      delay: 8000,
      callback: () => {
        const currentDelay = currentScene.itemsCreation.delay
        const newDelay = currentDelay - (currentDelay * 0.25)

        if (newDelay > 250) {
          currentScene.itemsCreation.delay = currentDelay - (currentDelay * 0.25) 
        }
      },
      repeat: -1
    })
  }
 
  createItem(scene) {
    const items = ['mask', 'alcool', 'gloves', 'soap', 'virus']
    const randomItem = items[Math.floor(Math.random() * items .length)];
    const randomItemHeightFall = Math.random() * (((window.innerHeight / 2 - 400))  - window.innerHeight / 2 ) + window.innerHeight / 2; 
  
    var itemSprite = scene.physics.add.image(window.innerWidth / 2, window.innerHeight + 100, randomItem)
                                       .setScale(0.5)
                                       .setInteractive()
  
    itemSprite.isVirus = randomItem === 'virus'                                    
    
    const randomVelocity = Math.random() * (250 - 220) + 220;
  
    itemSprite.setVelocity(randomVelocity * this.getRandomNumberSignal());
  
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
            setTimeout(() => {
              scene.gameOver(scene)
            }, 1000)
          }
        }
      }
    });
    
    itemSprite.on('pointerdown', () => {
  
      if (itemSprite.isVirus) {
        scene.gameOver(scene)
      } else if (scene.lives){
        const score = scene.scoreText
        const currentScore = score.text
        scene.hitSound.play()
  
        itemTween.stop()
  
        const newItemTween = scene.tweens.add({
          targets: itemSprite,
          y: 350,
          x: 200,
          duration: 100,
          ease: 'Sine',
          onComplete: () => {
            itemSprite.alpha = 0
          }
        });
  
        score.setText(parseInt(currentScore) + 10)
      }
    });
  } 
  
  getRandomNumberSignal() {
    return (Math.random() - 0.5) * 2
  }
  
  gameOver(scene) {
    scene.backgroundSong.stop()
    scene.gameOverSound.play()
    alert('GAME OVER')
    scene.scene.restart()
  }

}