// @ts-check
import Card from './Card.js'
import { getKeyPair, testKeyPair } from '../../Helpers.js'

/**
* Generator Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Generator extends Card {
  constructor (options, ...args) {
    super(options, ...args)

    this.buttonGenerateKeysClickEventListener = event => {
      self.requestAnimationFrame(timeStamp => {
        this.bitcoinAddressEls.forEach(el => (el.textContent = 'generating...'))
        this.privateKeyEls.forEach(el => (el.textContent = 'generating...'))
        self.requestAnimationFrame(timeStamp => {
          const {bitcoinAddress, keyPairWIF} = this.generateKey()
          this.bitcoinAddressEls.forEach(el => (el.textContent = bitcoinAddress))
          this.privateKeyEls.forEach(el => (el.textContent = keyPairWIF))
          self.print()
        })
      })
    }

    this.beforeprintEventListener = event => console.log('****beforeprint*****')
    this.afterprintEventListener = event => console.log('****afterprint*****')
  }

  connectedCallback () {
    const result = super.connectedCallback()
    this.buttonGenerateKeys.addEventListener('click', this.buttonGenerateKeysClickEventListener)
    self.addEventListener('beforeprint', this.beforeprintEventListener)
    self.addEventListener('afterprint', this.afterprintEventListener)
    return result
  }

  disconnectedCallback () {
    self.removeEventListener('beforeprint', this.beforeprintEventListener)
    self.removeEventListener('afterprint', this.afterprintEventListener)
    super.disconnectedCallback()
  }

  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section {
        & > header > section {
          border: 1px solid var(--a-color);
          display: flex;
          gap: 1em;
          padding: 1em;
        }
        & > main {
          .cards {
            gap: 0;
            &:nth-child(even) {
              transform: rotate(180deg);
            }
          }
          .card-with-img {
            width: 20%;
          }
        }
      }
      @media print {
        :host > section {
          display: block;
          margin: 0;
          & > main {
            overflow: visible;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            & > .a4 {
              display: flex;
              flex-direction: column;
              width: 297mm;
              height: 210mm;
              justify-content: center;
              align-items: center;
              break-after: page;
              box-sizing: border-box;
              padding: 5mm;
              & > .cards {
                width: 100%;
              }
              &:last-child {
                break-after: auto;
              }
            }
          }
        }
        @page {
          size: landscape; /* or "portrait", or "A4 landscape" */
        }
      }
    `
    return result
  }

  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  async renderHTML () {
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
          <h1 class=font-size-h2>Step Two: Generate your key pairs</h1>
          <section>
            <button id=generate-keys>generate Keys</button>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
          <br>
        </header>
        <main>
          <p class=no-print>bitcoinAddress: <span bitcoin-address></span></p>
          <p class=no-print>privateKey: <span private-key></span></p>
          <div class=a4>
            <div class="cards">
              ${this.renderCard('oym__print_final1.jpg', 5, [])}
            </div>
            <div class="cards">
              ${this.renderCard('oym__print_final1.jpg', 5, [])}
            </div>
          </div>
          <div class=a4>
            <div class="cards">
              ${this.renderCard('oym__print_final2.jpg', 5, ['avatar'])}
            </div>
            <div class="cards">
              ${this.renderCard('oym__print_final2.jpg', 5, ['avatar'])}
            </div>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    const avatarFile = await this.webWorker(Generator.loadFile, self.localStorage.getItem('avatarFileName') || 'avatar.jpg')
    const imgAvatarUrl = URL.createObjectURL(avatarFile)
    this.imgAvatars.forEach(imgAvatar => imgAvatar.src = imgAvatarUrl)
  }

  renderCard(name, length, imgTypes) {
    let result = ''
    for (let index = 0; index < length; index++) {
      result += /* html */`
        <div class=card-with-img>
          <img id=background-two-img src="./src/img/${name}" />
          ${imgTypes.reduce((acc, curr) => /* html */`
            ${acc}
            <div class=img-container>
              <img class="img ${curr}" />
            </div>  
          `, '')}
          
        </div>
      `
    }
    return result
  }

  generateKey () {
    return testKeyPair(getKeyPair())
  }

  get buttonGenerateKeys () {
    return this.root.querySelector('#generate-keys')
  }

  get bitcoinAddressEls () {
    return Array.from(this.root.querySelectorAll('[bitcoin-address]'))
  }

  get privateKeyEls () {
    return Array.from(this.root.querySelectorAll('[private-key]'))
  }
}
