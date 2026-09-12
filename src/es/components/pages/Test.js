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

    let scanResult
    this.resetScanResult = () => {
      if (this.qrResultElement) this.qrResultElement.textContent = 'Scan: "Verify Now" - QR CODE'
      return scanResult = {
        verifyUrl: '',
        bitcoinAddress: ''
      }
    }
    this.resetScanResult()
    this.qrScannerEventListener = async ({data: dataString}) => {
      if (!scanResult.bitcoinAddress) {
        try {
          const url = new URL(dataString)
          scanResult.verifyUrl = dataString
          scanResult.bitcoinAddress = url.hash.replace('#', '')
          this.qrResultElement.textContent = `URL recognized! Scan: "Public Key": ${scanResult.bitcoinAddress}`
        } catch (error) {
          this.qrResultElement.textContent = 'Scan: "Verify Now" - QR CODE'
        }
      } else if (scanResult.bitcoinAddress === dataString) {
        this.qrResultElement.textContent = '"Public Key" matches "Verify Now" - QR CODE! Scan: "Private Key" on the backside of the card!'
      } else if (scanResult.bitcoinAddress) {
        try {
          if (testKeyPairWIFtoBitcoinAddress(dataString, scanResult.bitcoinAddress)) {
            this.qrResultElement.textContent = 'All done! Nice!'
            const url = new URL(scanResult.verifyUrl)
            let timestamp, printSeries, printData
            if ((timestamp = url.searchParams.get('ts')) && (printData = (printSeries = await this.printSeries)[timestamp])) {
              let foundData
              if ((foundData = printData.bitcoinAddresses.find(({bitcoinAddress}) => bitcoinAddress === scanResult.bitcoinAddress))) {
                foundData.verified = true
                this.dispatchEvent(new CustomEvent('storage-set', {
                  detail: {
                    key: 'printSeries',
                    value: printSeries
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }))
                this.resetScanResult()
                let printSeriesChildElement, counter
                if (!(printSeriesChildElement = this.printSeriesElement.querySelector(`#t_${timestamp}`))) {
                  printSeriesChildElement = document.createElement('p')
                  printSeriesChildElement.setAttribute('id', `t_${timestamp}`)
                  counter = document.createElement('p')
                  counter.setAttribute('counter', '')
                  printSeriesChildElement.appendChild(counter)
                  this.printSeriesElement.appendChild(printSeriesChildElement)
                }
                if (!counter) counter = printSeriesChildElement.querySelector('[counter]')
                counter.textContent = `Printed at ${(new Date(timestamp)).toLocaleString(navigator.language)}; verified: ${printSeries[timestamp].bitcoinAddresses.filter(data => data.verified).length}/${printSeries[timestamp].bitcoinAddresses.length}`
                let printSeriesCvcElement
                if (!(printSeriesCvcElement = printSeriesChildElement.querySelector(`[cvc=cvc_${foundData.cvc}]`))) {
                  printSeriesCvcElement = document.createElement('p')
                  printSeriesCvcElement.setAttribute('cvc', `cvc_${foundData.cvc}`)
                  printSeriesChildElement.appendChild(printSeriesCvcElement)
                }
                printSeriesCvcElement.textContent = `CVC: ${foundData.cvc} - verified = ${foundData.verified}`
              }
            }
          }
        } catch (error) {
          console.info(error)
        }
      }
    }
  }

  connectedCallback () {
    this.resetScanResult()
    const shouldRenderHTML= this.shouldRenderHTML()
    const result = super.connectedCallback()
    if (shouldRenderHTML) {
      result.then(async () => {
        let video, errorEl
        ({qrScanner: this.qrScanner, video, errorEl} = await this.#startQrScanner(this.qrScannerEventListener, this.video))
        this.start(video, this.qrResultElement, errorEl)
      })
    } else {
      this.qrScanner.start()
    }
    return result
  }

  disconnectedCallback () {
    this.qrScanner.stop()
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
        & > section > video {
          max-width: min(100%, 75svh);
          margin-bottom: 1em;
          transform: none !important;
          opacity: 1 !important;
          width: 100% !important;
          height: auto !important;
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
          <section id=qr-scanner>
            <video></video>
            <p id=qr-result class=center></p>
            <div id=print-series></div>
          </section>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
  }

  start (video, resultEl, errorEl) {
    this.qrScanner.start()
    // must add video to dom again, otherwise qr-scanner places it on body
    this.qrScannerSection.prepend(video)
    resultEl.textContent = 'Scan: "Verify Now" - QR CODE'
    // TODO: handle Error and add visual target sugar as in example: https://github.com/nimiq/qr-scanner/blob/master/demo/index.html
    //errorEl.classList.add('center')
    //this.qrScannerSection.appendChild(errorEl)
  }

  #startQrScanner (func, video = document.createElement('video'), errorEl = document.createElement('p')) {
    return import(`${this.importMetaUrl}../../libs/qr-scanner.min.js`).then(async module => {
        const QrScanner = module.default
        const result = {
          video,
          errorEl,
          qrScanner: new QrScanner(
            video,
            func,
            {
              onDecodeError: error => (errorEl.textContent = error),
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          ),
          hasCamera: await QrScanner.hasCamera()
        }
        return result
    })
  }

  get qrScannerSection () {
    return this.root.querySelector('#qr-scanner')
  }

  get qrResultElement () {
    return this.qrScannerSection?.querySelector('#qr-result')
  }

  get printSeriesElement () {
    return this.qrScannerSection?.querySelector('#print-series')
  }

  get video () {
    return this.qrScannerSection?.querySelector('video')
  }

  get printSeries () {
    return new Promise(resolve => this.dispatchEvent(new CustomEvent('storage-get', {
      detail: {
        key: 'printSeries',
        resolve
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))).then(data => data.value)
  }
}
