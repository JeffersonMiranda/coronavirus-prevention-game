import Phaser from 'phaser'
import { getCookie, setCookie } from './cookies'

export default class GameOverScene extends Phaser.Scene {

  constructor (config) {
    super(config)
  }

  init(data){
    this.setNewScore(data.points)
    this.points = data.points
  }

  setNewScore(score) {
    const cookieName = 'corona_game_max_score'
    this.maxScore = getCookie(cookieName)

    if (this.maxScore == '' || score > this.maxScore) {
      setCookie(cookieName, score, 3200)
      this.maxScore = score
    }
  }
  
  create() {
    this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'menuBackground')
    this.background.setScale(2.7)

    this.score = this.add.text(window.innerWidth / 2, 220, `${this.points} pontos`, { fontSize: '80px', fill: '#fff', align: 'center' }).setOrigin(0.5)
    
    if (getCookie('corona_game_max_score')) {
      this.maxScore = this.add.text(window.innerWidth / 2, 320, `Pontuação máxima: ${this.maxScore}`, { fontSize: '50px', fill: '#fff', align: 'center' }).setOrigin(0.5)
    }

    const tips = [
      'Lave as mãos frequentemente por 20 segundos',
      'Use o cotovelo para cobrir a tosse',
      'Não toque no rosto',
      'Mantenha uma distância segura entre você e outra pessoa',
      'Só saia de casa se houver necessidade'
    ]

    const tipsContainer = this.add.dom(window.innerWidth / 2, window.innerHeight / 2.5, 'div')

    tipsContainer.setClassName('rulesBoard')
    tipsContainer.setHTML(`<h1> LEMBRE-SE </h1> <ul list-style="initial"> <li> ${tips[0]} </li> <li> ${tips[1]} </li> <li> ${tips[2]} </li> <li> ${tips[3]} </li> <li> ${tips[4]} </li> </ul>`)

    const informationLink = 'https://www.saude.gov.br/images/pdf/2020/marco/26/Cartaz-Geral-64x46cm.pdf'
    const moreInformationHeader = this.add.dom(window.innerWidth / 2, window.innerHeight / 1.60)
                                          .createFromHTML(`<a class="more-information-link" href=${informationLink} target="_blank"> Clique aqui e saiba mais como se proteger </a>`)  
                                          .setOrigin(0.5)


    

    const gameLink =  'CORONA PREVENTION GAME - Aprenda a se proteger do novo coronavírus com este simples jogo!' //'https://fierce-ridge-75316.herokuapp.com/'
    
    const shareHeader = this.add.dom(window.innerWidth / 2, window.innerHeight / 1.45)
                                          .createFromHTML(`<h1 class="share-header" href=${informationLink}> Compartilhe este jogo com seus amigos! </h1>`)  


    const whatsappButtonHtml = `
    <a class="whatsapp-link" href="https://api.whatsapp.com/send?text=${gameLink}" data-action="share/whatsapp/share" target="_blank"></a>
    ` 

    const whatsappShareButton = this.add.dom(window.innerWidth / 2.6, window.innerHeight / 1.33).createFromHTML(whatsappButtonHtml)

    const facebookButtonHtml = `
      <a href="https://www.facebook.com/sharer/sharer.php?t=${gameLink}&u=https://fierce-ridge-75316.herokuapp.com/" target="_blank">FACEBOOK</a>
    ` 

    const facebookShareButton = this.add.dom(window.innerWidth / 1.5, window.innerHeight / 1.33).createFromHTML(facebookButtonHtml)  

    const restartButton = this.add.dom(window.innerWidth / 2, window.innerHeight - 250, 'div', null ,'JOGAR NOVAMENTE')

    restartButton.setClassName('startButton disable-dbl-tap-zoom')

    const currentScene = this

    restartButton.addListener('click')
              .on('click', () => {
                currentScene.scene.start('gamePlay');
              })
  }
}