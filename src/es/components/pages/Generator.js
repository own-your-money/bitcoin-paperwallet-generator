// @ts-check
import Index from './Index.js'
import { WebWorker } from '../../event-driven-web-components-prototypes/src/WebWorker.js'
import { getKeyPair, getBitcoinAddress, testKeyPair } from '../../Helpers.js'

/**
* Generator Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Generator extends WebWorker(Index) {
  constructor (options, ...args) {
    super(options, ...args)

    this.inputBackgroundChangeEventListener = event => {
      const file = this.inputBackgroundOne.files?.[0]
      if (!file) return
      this.inputBackgroundOneImg.src = URL.createObjectURL(file)
    }

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

    // @ts-ignore
    this.footer = `<a href="https://github.com/own-your-money/bitcoin-paperwallet-generator" target="_blank">© OYM / ${Environment.stage} ${Environment.version}</a>`
  }

  connectedCallback () {
    super.connectedCallback()
    this.inputBackgroundOne.addEventListener('change', this.inputBackgroundChangeEventListener)
    this.buttonGenerateKeys.addEventListener('click', this.buttonGenerateKeysClickEventListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.inputBackgroundOne.removeEventListener('change', this.inputBackgroundChangeEventListener)
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
  renderHTML () {
    this.html = /* html */`
      <section>
        <header>
          <h1>OYM Generator</h1>
          <p class=center>
            <a href="?page=/" route target="_self"><span>👉 back</span></a>
          </p>
          <br>
          <section>
            <input type="file" id="background-one" accept="image/*">
            <button id=generate-keys>generate Keys</button>
          </section>
          <br>
        </header>
        <main>
          <p>bitcoinAddress: <span bitcoin-address></span></p>
          <p>privateKey: <span private-key></span></p>
          <img id=background-one-img />
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }

  generateKey () {
    return testKeyPair(getKeyPair())
  }

  get inputBackgroundOne () {
    return this.root.querySelector('#background-one')
  }

  get inputBackgroundOneImg () {
    return this.root.querySelector('#background-one-img')
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
