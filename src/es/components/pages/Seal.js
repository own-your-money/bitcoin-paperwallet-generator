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
          <h1 class=font-size-h2>Step Four: Immediately seal all the private keys!</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/seal" route target="_self">Next Step: Stamp the seals</a>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
        </header>
        <main>
          <h3>Seal all the private keys</h3>
          <section id=qr-scanner>
            seal pic
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
        <a download="${seriesObj.producerName}-${timestamp}.json" rel="noopener" href="${URL.createObjectURL(new Blob([JSON.stringify(seriesObj, null, 2)], { type: 'application/json' }))}">${(new Date(Number(timestamp))).toLocaleString(navigator.language)}</a>
        <a id="delete-series">delete</a>
      `
    } else {
      li.innerHTML = /* HTML */`
        <span>${(new Date(Number(timestamp))).toLocaleString(navigator.language)}</span>
        <a id="delete-series">delete</a>
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
