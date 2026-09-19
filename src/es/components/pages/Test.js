// @ts-check
import IndexPrototype from './IndexPrototype.js'
import { testKeyPairWIFtoBitcoinAddress } from '../../Helpers.js'

/**
* Test Main/Start Page
*
* @export
* @class IndexPrototype
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Test extends IndexPrototype {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    let scanResult
    this.resetScanResult = () => {
      if (this.qrResultElement) this.qrResultElement.textContent = 'Scan: "Verify Now" - QR CODE'
      if (this.qrCurrentElement) this.qrCurrentElement.innerHTML = ''
      return scanResult = {
        verifyUrl: '',
        bitcoinAddress: ''
      }
    }
    this.resetScanResult()
    this.qrScannerEventListener = async ({data: dataString}) => {
      this.qrCurrentElement.innerHTML = `<a href="${dataString}" target=_blank>${dataString}</a>`
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
                new Promise(resolve => this.dispatchEvent(new CustomEvent('storage-set', {
                  detail: {
                    key: 'printSeries',
                    value: printSeries,
                    resolve
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }))).then(() => this.renderPreviousSeries())
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
                counter.textContent = `Printed at ${(new Date(Number(timestamp))).toLocaleString(navigator.language)}; verified: ${printSeries[timestamp].bitcoinAddresses.filter(data => data.verified).length}/${printSeries[timestamp].bitcoinAddresses.length}`
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

    this.irisSwissLinkClickEventListener = event => {
      event.preventDefault()
      const a = document.createElement('a')
      const roomName = `chat-iris-swiss-certification-room-${self.crypto.randomUUID()}`
      a.href = `mailto:info@iris-swiss.com?subject=Certification of OYM print series - ${roomName}&body=${encodeURIComponent(`1: Open this room in a browser:\nhttps://decentral.ninja/?page=%2Fchat&websocket-url=wss%3A%2F%2Fheroku.decentral.ninja%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket.peerweb.site%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket-two.peerweb.site%2F%3Fkeep-alive%3D432000000&webrtc-url=wss%3A%2F%2Fwebrtc-two.peerweb.site%2F%2Cwss%3A%2F%2Fwebrtc.peerweb.site%2F&room=${roomName}\n\n2: Create a key, upload and encrypt all print series JSON files!\n\n3: Send this mail to us!\n\nAlternatively, directly attach the print series JSON files to this mail...\n\n[ADD YOUR MESSAGE HERE]`)}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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
        this.renderPreviousSeries()
      })
    } else {
      this.qrScanner.start()
    }
    this.irisSwissLink.addEventListener('click', this.irisSwissLinkClickEventListener)
    return result
  }

  disconnectedCallback () {
    this.qrScanner.stop()
    this.irisSwissLink.removeEventListener('click', this.irisSwissLinkClickEventListener)
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
      :host > section > header {
        padding-bottom: 1em;
      }
      :host > section {
        &:has(> header #blur-video:checked) > main > section > video {
          filter: blur(10px);
        }
        & > main {
          text-align: center;
          & > section > video {
            max-width: min(100%, 75svh);
            margin-bottom: 1em;
            transform: none !important;
            opacity: 1 !important;
            width: 100% !important;
            height: auto !important;
          }
          #delete-series {
            color: red;
          }
          ol {
            margin: 1em;
            & > li {
              margin-bottom: 0.5em;
              & > div {
                display: flex;
                justify-content: space-between;
              }
            }
          }
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
          <a href="?page=/production" route target="_self"><img class=oym-img src="${this.importMetaUrl}../../../img/OYM.png" /></a>
          <h1 class=font-size-h2>Step: Test key pairs!</h1>
          <section>
            <div>
              <input id=blur-video checked type=checkbox>
              <label for=blur-video>blur video for safety</label>
            </div>
            <a id=next-step href="?page=/seal" route target="_self">Next Step: Seal & Stamp the private keys</a>
          </section>
        </header>
        <main>
          <h3>Scan your previously printed cards...</h3>
          <section id=qr-scanner>
            <video></video>
            <p id=qr-result class=center></p>
            <p id=qr-current class=center></p>
            <div id=print-series></div>
            <hr>
            <details id=pending-series open>
              <summary>Print series test pending</summary>
              <ol></ol>
            </details>
            <hr>
            <details id=successful-series open>
              <summary>Print series tested successfully</summary>
              <ol></ol>
              <h5>Click, download and hand the print series JSON in to: <a id=iris-swiss>Iris-Swiss</a> to certify it!</h5>
            </details>
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

  async renderPreviousSeries () {
    const printSeries = await this.printSeries
    const successfulSeriesList= this.successfulSeriesElement.querySelector('ol')
    successfulSeriesList.innerHTML = ''
    const pendingSeriesElement= this.pendingSeriesElement.querySelector('ol')
    pendingSeriesElement.innerHTML = ''
    Object.keys(printSeries).forEach(timestamp => {
      let success
      const parentElement = (success = printSeries[timestamp].bitcoinAddresses.every(bitcoinAddress => bitcoinAddress.verified))
        ? successfulSeriesList
        : pendingSeriesElement
      this.renderPreviousSeriesListElement(parentElement, timestamp, success, printSeries[timestamp], printSeries)
    })
  }

  renderPreviousSeriesListElement (parentElement, timestamp, success, seriesObj, printSeries) {
    if (parentElement.querySelector(`[timestamp=t_${timestamp}]`)) return
    const li = document.createElement('li')
    li.setAttribute('timestamp', `t_${timestamp}`)
    if (success) {
      li.innerHTML = /* HTML */`
        <div>
          <a download="${seriesObj.producerName}-${timestamp}.json" rel="noopener" href="${URL.createObjectURL(new Blob([JSON.stringify(seriesObj, null, 2)], { type: 'application/json' }))}">${(new Date(Number(timestamp))).toLocaleString(navigator.language)}</a>
          <a id="delete-series">delete</a>
        </div>
      `
    } else {
      li.innerHTML = /* HTML */`
        <div>
          <span>${(new Date(Number(timestamp))).toLocaleString(navigator.language)}</span>
          <a id="delete-series">delete</a>
        </div>
      `
    }
    li.querySelector('#delete-series')?.addEventListener('click', event => {
      if (self.confirm(`Do you really want to delete the print series ${timestamp}?`)) {
        delete printSeries[timestamp]
        new Promise(resolve => this.dispatchEvent(new CustomEvent('storage-set', {
          detail: {
            key: 'printSeries',
            value: printSeries,
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))).then(() => this.renderPreviousSeries())
      }
    })
    parentElement.appendChild(li)
  }

  get qrScannerSection () {
    return this.root.querySelector('#qr-scanner')
  }

  get qrResultElement () {
    return this.qrScannerSection?.querySelector('#qr-result')
  }

  get qrCurrentElement () {
    return this.qrScannerSection?.querySelector('#qr-current')
  }

  get printSeriesElement () {
    return this.qrScannerSection?.querySelector('#print-series')
  }

  get successfulSeriesElement () {
    return this.qrScannerSection?.querySelector('#successful-series')
  }

  get pendingSeriesElement () {
    return this.qrScannerSection?.querySelector('#pending-series')
  }

  get irisSwissLink () {
    return this.qrScannerSection?.querySelector('#iris-swiss')
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
