import Phaser from "phaser"
import gameplayBackground from "./assets/images/gameplayBackground.png"
import menuBackground from "./assets/images/menuBackground.png"
import basketImg from "./assets/images/basket.png"
import logoImg from "./assets/images/mask.png"
import alcoolImg from "./assets/images/alcool.png"
import glovesImg from "./assets/images/gloves.png"
import soapImg from "./assets/images/soap.png"
import virusImg from "./assets/images/virus.png"
import heartImg from "./assets/images/heart.png"
import backgroundSong from "./assets/audio/background.wav"
import hitSound from "./assets/audio/hit.wav"
import gameOverSound from "./assets/audio/gameover.mp3"

import GamePlayScene from './GamePlayScene'

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
  dom: {
    createContainer: true
  },
  scene: {
    preload: preload,
    create: MenuCreate
  }
};

const game = new Phaser.Game(config)

function MenuCreate() {
  this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'menuBackground')
  this.background.setScale(3.8)

  const gamePlayScene = new GamePlayScene()

  this.scene.add('gamePlay', GamePlayScene);

  const gameName = this.add.dom(window.innerWidth / 2, 200, 'h1', null, 'CORONA PREVENTION')
  gameName.setClassName('gameName')

  const rulesItems = [
    'Regras',
    '1. Colete todos os itens de combate e prevenção ao novo coronavírus.',
    '2. Você inicia com três vidas, a cada item não coletado, uma vida é perdida.',
    '3. O jogo é finalizado se todas as vidas forem perdidas ou se o vírus for coletado.' 
  ]


  const rulesBoard = this.add.dom(window.innerWidth / 2, window.innerHeight / 3, 'div')

  rulesBoard.setClassName('rulesBoard')
  rulesBoard.setHTML(`<h1> ${rulesItems[0]} </h1> <ul> <li> ${rulesItems[1]} </li> <li> ${rulesItems[2]} </li> <li> ${rulesItems[3]} </li> </ul>`)
  
  const startButton = this.add.dom(window.innerWidth / 2, window.innerHeight - 400, 'div', null ,'INICIAR')

  startButton.setClassName('startButton')

  const currentScene = this

  startButton.addListener('click')
             .on('click', () => {
              currentScene.scene.start('gamePlay');
             })

  const developerName = this.add.dom(window.innerWidth / 2, window.innerHeight - 200, 'h6', null ,'Desenvolvido por Jefferson Miranda')

  developerName.setClassName('developer')
}

function preload() {
  this.load.image('gameplayBackground', gameplayBackground)
  this.load.image('menuBackground', menuBackground)
  this.load.image('mask', logoImg)
  this.load.image('alcool', alcoolImg)
  this.load.image('gloves', glovesImg)
  this.load.image('soap', soapImg)
  this.load.image('virus', virusImg)
  this.load.image('basket', basketImg)
  this.load.image('heart', heartImg)
  this.load.audio('backgroundSong', backgroundSong);
  this.load.audio('hitSound', hitSound);
  this.load.audio('gameOverSound', gameOverSound);
}