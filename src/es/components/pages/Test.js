// @ts-check
import Index from './Index.js'
import { WebWorker } from '../../event-driven-web-components-prototypes/src/WebWorker.js'
import { testKeyPairWIFtoBitcoinAddress } from '../../Helpers.js'

/**
* Test Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Test extends WebWorker(Index) {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    const scanResult = {
      verifyUrl: '',
      bitcoinAddress: '',
      keyPairWIF: ''
    }
    this.qrScannerEventListener = dataString => {
      if (!scanResult.bitcoinAddress) {
        try {
          const url = new URL(dataString)
          scanResult.verifyUrl = dataString
          scanResult.bitcoinAddress = url.hash.replace('#', '')
          this.p.textContent = `URL recognized! Scan: "Public Key": ${scanResult.bitcoinAddress}`
        } catch (error) {
          this.p.textContent = 'Scan: "Verify Now" - QR CODE'
        }
      } else if (scanResult.bitcoinAddress === dataString) {
        this.p.textContent = '"Public Key" matches "Verify Now" - QR CODE! Scan: "Private Key" on the backside of the card!'
      } else if (scanResult.bitcoinAddress) {
        try {
          if (testKeyPairWIFtoBitcoinAddress(dataString, scanResult.bitcoinAddress)) this.p.textContent = 'All done! Nice!'
        } catch (error) {
          
        }
      }
      console.log('*********', dataString)
    }
  }

  connectedCallback () {
    const result = super.connectedCallback()
    result.then(async () => {
      let video
      ({qrScanner: this.qrScanner, video} = await this.#startQrScanner(this.qrScannerEventListener))
      video.setAttribute('style', '')
      this.main.appendChild(video)
      this.start()
    })
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
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section > main {
        text-align: center;
        & > video {
          max-width: min(100%, 75svh);
          margin-bottom: 1em;
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
          <h1 class=font-size-h2>Step Three: Test your cards</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/seal" route target="_self">Next Step: Immediately seal the private key</a>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
        </header>
        <main>
          <h3>Scan your previously printed cards...</h3>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
  }

  start () {
    this.qrScanner.start()
    const p = document.createElement('p')
    p.setAttribute(`scan-${this.scanCounter || (this.scanCounter = 0)}`, '')
    this.scanCounter++
    p.textContent = 'Scan: "Verify Now" - QR CODE'
    p.classList.add('center')
    this.main.appendChild(p)
  }

  #startQrScanner (func) {
    return import(`${this.importMetaUrl}../../libs/qr-scanner.min.js`).then(async module => {
        const QrScanner = module.default
        const video = document.createElement('video')
        return {
          video,
          qrScanner: new QrScanner(
            video,
            func
          ),
          hasCamera: await QrScanner.hasCamera()
        }
    })
  }

  get main () {
    return this.root.querySelector('main')
  }

  get p () {
    return this.main.querySelector('p')
  }
}
