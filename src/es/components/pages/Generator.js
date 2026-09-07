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
        })
      })
    }
  }

  connectedCallback () {
    const result = super.connectedCallback()
    this.buttonGenerateKeys.addEventListener('click', this.buttonGenerateKeysClickEventListener)
    return result
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */ `
      :host > section > header > section {
        border: 1px solid var(--a-color);
        display: flex;
        gap: 1em;
        padding: 1em;
      }
    `
    return super.renderCSS()
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
        </header>
        <main>
          <p>bitcoinAddress: <span bitcoin-address></span></p>
          <p>privateKey: <span private-key></span></p>
          <div class=grid>
            <img id=background-two-img src="./src/img/oym__print_final2.jpg" />
            <div id=avatar-img-container>
              <img id=avatar-img />
            </div>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    const avatarFile = await this.webWorker(Generator.loadFile, self.localStorage.getItem('avatarFileName') || 'avatar.jpg')
    this.imgAvatar.src = URL.createObjectURL(avatarFile)
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
