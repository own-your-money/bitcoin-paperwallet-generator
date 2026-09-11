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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.buttonGenerateTestDataClickEventListener = (event, hidingQR = false) => {
      if (!hidingQR) {
        this.setAttribute('mode', 'test')
        this.storageMerge('flipOnLongSide', this.flipOnLongSide.checked)
        this.storageMerge('cardCount', this.cardCount.value)
      }
      this.cards.forEach((cards, i) => cards.forEach(card => {
        if (i >= this.cardCount.value) {
          card.classList.add('hidden')
        } else {
          card.classList.remove('hidden')
        }
        Array.from(card.querySelectorAll('div')).forEach(container => container.textContent = `${Array.from(container.classList).reduce((acc, curr) => (acc = `${acc ? `${acc}, ` : ''}${curr}`, ''))} CARD: ${i}`)
      }))
    }

    this.buttonPrintClickEventListener = event => {
      if (!this.inputProducerName.value) {
        this.inputProducerName.focus()
        return alert('Producer nickname is required!')
      }
      if (this.inputVerifyUrlOrigin.value) {
        try {
          new URL(this.inputVerifyUrlOrigin.value)
        } catch (error) {
          this.inputVerifyUrlOrigin.focus()
          return alert('Verify URL origin is invalid!')
        }
      }
      this.dialogPrintSetting.showModal()
      const clickEvent = event => {
        self.print()
        this.dialogPrintSetting.close()
      }
      this.dialogPrintSetting.addEventListener('click', clickEvent, {once: true})
      this.dialogPrintSetting.addEventListener('close', event => {
        this.buttonGenerateTestDataClickEventListener(event, true)
        this.dialogPrintSetting.removeEventListener('click', clickEvent)
      }, {once: true})
    }

    this.buttonSkipClickEventListener = event => this.setAttribute('mode', 'test-success')

    const pageAdjustFunc = (selector, name, value, direction) => {
      const key = `${name}${direction}adjust`
      this.root.querySelector(`.${selector}`).setAttribute(key, value)
      this.storageMerge(key, value)
    }
    this.inputPageOneHorizontalAdjustChangeEventListener = event => pageAdjustFunc('page-one', 'pageOne', event.target.value, 'horizontal')
    this.inputPageOneVerticalAdjustChangeEventListener = event => pageAdjustFunc('page-one', 'pageOne', event.target.value, 'vertical')
    this.inputPageTwoHorizontalAdjustChangeEventListener = event => pageAdjustFunc('page-two', 'pageTwo', event.target.value, 'horizontal')
    this.inputPageTwoVerticalAdjustChangeEventListener = event => pageAdjustFunc('page-two', 'pageTwo', event.target.value, 'vertical')

    this.inputVerifyUrlOriginChangeEventListener = event => this.storageMerge('verifyUrlOrigin', event.target.value)

    this.inputProducerNameChangeEventListener = event => this.storageMerge('producerName', event.target.value)

    this.inputAmountChangeEventListener = event => this.storageMerge('amount', event.target.value)

    let generationAvailable = true
    this.buttonGenerateKeysClickEventListener = event => {
      if (!generationAvailable) return
      if (navigator.onLine && !confirm('Go offline for printing... are you offline?')) return
      generationAvailable = false
      self.requestAnimationFrame(timeStamp => {
        this.buttonGenerateKeys.textContent = 'Generating...'
        const verifyUrlOrigin =  this.inputVerifyUrlOrigin.value || this.inputVerifyUrlOrigin.getAttribute('placeholder')
        const producerName =  this.inputProducerName.value || 'unknown'
        const currency = 'btc'
        const amount = this.inputAmount.value || 0.0001
        const printTimeStamp = Date.now()
        /** @type {{verifyUrlOrigin: string, producerName: string, currency: string, amount: string, printTimeStamp: number, bitcoinAddresses: {bitcoinAddress: string, verified: false}[]}} */
        this.printData = {
          verifyUrlOrigin,
          producerName,
          currency,
          amount,
          printTimeStamp,
          bitcoinAddresses: []
        }
        self.requestAnimationFrame(async timeStamp => {
          await Promise.all(this.cards.flatMap(cards => {
            if (cards[0].classList.contains('hidden')) return Promise.resolve()
            const {bitcoinAddress, keyPairWIF} = this.generateKey()
            if (!bitcoinAddress || !keyPairWIF) return console.error('Key generation did not work:', {bitcoinAddress, keyPairWIF})
            this.printData.bitcoinAddresses.push({bitcoinAddress, verified: false})
            return cards.flatMap(card => Array.from(card.querySelectorAll('div')).flatMap(async container => {
              if (container.classList.contains('verify-url-container')) {
                container.innerHTML = /* html */`
                  <span>${amount}&nbsp;${currency.toUpperCase()}</span>
                `
                const canvas = await this.#getQrCanvas(`${verifyUrlOrigin}?cur=${currency}&amt=${amount}&ts=${printTimeStamp}&prd=${producerName}#${bitcoinAddress}`, container)
                container.appendChild(canvas)
              } else if (container.classList.contains('public-key-container')) {
                container.innerHTML = ''
                const canvas = await this.#getQrCanvas(bitcoinAddress, container)
                container.appendChild(canvas)
              } else if (container.classList.contains('private-key-container')) {
                container.innerHTML = /* html */`
                  <span class=cvc>${self.crypto.randomUUID().replace(/^.*-/, '').substring(0, 7)}</span>
                `
                const canvas = await this.#getQrCanvas(keyPairWIF, container)
                container.appendChild(canvas)
              } else if (container.classList.contains('avatar-container')) {
                container.innerHTML = ''
                const img = document.createElement('img')
                const avatarFile = await this.webWorker(Generator.loadFile, await this.storageGet('avatarFileName') || 'avatar.jpg')
                if (avatarFile) {
                  img.setAttribute('src', URL.createObjectURL(avatarFile))
                  container.appendChild(img)
                } else {
                  container.innerHTML = '<h5>Warning: Avatar file is missing...</h5>'
                }
              }
            }))
          }))
          this.buttonGenerateKeys.textContent = 'Generate keys and print!'
          generationAvailable = true
          this.buttonPrintClickEventListener()
        })
      })
    }

    this.afterprintEventListener = event => {
      if (this.getAttribute('mode') === 'test') {
        if (self.confirm('Did your test data print succeed?')) this.setAttribute('mode', 'test-success')
      } else if (this.printData && this.getAttribute('mode') === 'test-success') {
        if (self.confirm('Did your production print succeed?')) {
          this.setAttribute('mode', 'done')
          // bugfix: needs a timeout to trigger, reason unknown
          setTimeout(event => {
            this.dispatchEvent(new CustomEvent('storage-merge', {
              detail: {
                key: 'printSeries',
                value: {
                  [this.printData.printTimeStamp]: this.printData
                }
              },
              bubbles: true,
              cancelable: true,
              composed: true
            }))
            history.pushState({ ...history.state, pageTitle: 'Test the key pairs and print' }, '', `${location.origin}/?page=/test`)
          }, 1)
        }
      }
      this.buttonGenerateTestDataClickEventListener(event, true)
    }
  }

  connectedCallback () {
    const result = super.connectedCallback()
    result.then(() => {
      this.buttonGenerateTestDataClickEventListener()
      this.buttonPrintTestData.addEventListener('click', this.buttonPrintClickEventListener)
      this.buttonSkipTest.addEventListener('click', this.buttonSkipClickEventListener)
      this.flipOnLongSide.addEventListener('change', this.buttonGenerateTestDataClickEventListener)
      this.cardCount.addEventListener('change', this.buttonGenerateTestDataClickEventListener)
      this.inputPageOneHorizontalAdjust.addEventListener('change', this.inputPageOneHorizontalAdjustChangeEventListener)
      this.inputPageOneVerticalAdjust.addEventListener('change', this.inputPageOneVerticalAdjustChangeEventListener)
      this.inputPageTwoHorizontalAdjust.addEventListener('change', this.inputPageTwoHorizontalAdjustChangeEventListener)
      this.inputPageTwoVerticalAdjust.addEventListener('change', this.inputPageTwoVerticalAdjustChangeEventListener)
      this.inputVerifyUrlOrigin.addEventListener('change', this.inputVerifyUrlOriginChangeEventListener)
      this.inputProducerName.addEventListener('change', this.inputProducerNameChangeEventListener)
      this.inputAmount.addEventListener('change', this.inputAmountChangeEventListener)
      this.buttonGenerateKeys.addEventListener('click', this.buttonGenerateKeysClickEventListener)
    })
    self.addEventListener('afterprint', this.afterprintEventListener)
    return result
  }

  disconnectedCallback () {
    this.buttonPrintTestData.removeEventListener('click', this.buttonPrintClickEventListener)
    this.buttonSkipTest.removeEventListener('click', this.buttonSkipClickEventListener)
    this.flipOnLongSide.removeEventListener('change', this.buttonGenerateTestDataClickEventListener)
    this.cardCount.removeEventListener('change', this.buttonGenerateTestDataClickEventListener)
    this.inputPageOneHorizontalAdjust.removeEventListener('change', this.inputPageOneHorizontalAdjustChangeEventListener)
    this.inputPageOneVerticalAdjust.removeEventListener('change', this.inputPageOneVerticalAdjustChangeEventListener)
    this.inputPageTwoHorizontalAdjust.removeEventListener('change', this.inputPageTwoHorizontalAdjustChangeEventListener)
    this.inputPageTwoVerticalAdjust.removeEventListener('change', this.inputPageTwoVerticalAdjustChangeEventListener)
    this.inputVerifyUrlOrigin.removeEventListener('change', this.inputVerifyUrlOriginChangeEventListener)
    this.inputProducerName.removeEventListener('change', this.inputProducerNameChangeEventListener)
    this.inputAmount.removeEventListener('change', this.inputAmountChangeEventListener)
    this.buttonGenerateKeys.removeEventListener('click', this.buttonGenerateKeysClickEventListener)
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
        & > header {
          & > dialog {
            margin: 0;
            & > div > img {
              display: none;
            }
          }
          &:has(#edge-order:checked) > dialog > div > img.long-edge {
            display: block;
          }
          &:has(#edge-order:not(:checked)) > dialog > div > img.short-edge {
            display: block;
          }
          #print-settings > div {
            display: flex;
            flex-direction: column;
          }
          & > section {
            border: 1px solid var(--a-color);
            display: flex;
            gap: 1em;
            padding: 1em;
            #generate-keys {
              display: none;
            }
            & > div {
              display: flex;
              align-items: center;
              gap: 1em;
              flex-wrap: wrap;
              .page-setting {
                padding: 0.5em;
                border: 1px solid white;
              }
              div {
                display: none;
                text-align: left;
                & > div {
                  display: flex;
                  justify-content: space-between;
                  &:where(.verify-url-origin, .producer-name, .amount, .card-count) {
                    flex-direction: column;
                    justify-content: center;
                  }
                }
              }
            }
            #done {
              display: none;
            }
          }
        }
        & > main {
          & > .a4.page-one {
            margin-left: attr(page-one-horizontal-adjust mm, 0);
            margin-top: attr(page-one-vertical-adjust mm, 0); 
          }
          & > .a4.page-two {
            margin-left: attr(page-two-horizontal-adjust mm, 0);
            margin-top: attr(page-two-vertical-adjust mm, 0); 
          }
          .cards {
            gap: 0;
            &:nth-child(even) {
              transform: rotate(180deg);
            }
          }
          .card-with-img {
            width: 20%;
            &.hidden {
              visibility: hidden;
            }
            & > div{
              &:has(span) {
                display: grid;
                grid-template-columns: auto 1fr;
              }
              &:has(canvas, img) {
                color: black;
                border: 0;
                span {
                  transform: rotate(90deg);
                  width: 0.75em;
                  align-self: flex-start;
                  margin-top: -0.55em;
                  height: 0.6em;
                  &.cvc {
                    width: 0.85em;
                    padding-left: 0.5em;
                    margin-top: 0;
                  }
                }
              }
            }
          }
        }
      }
      :host([mode=test]) > section{
        & > header > section > div > div {
          display: block;
          &:has(> #edge-order) {
            max-width: 10svw;
          }
        }
        & > main .card-with-img {
          border: dotted 1px black;
          img {
            opacity: 0;
          }
        }
      }
      :host([mode=test-success]) > section > header > section #generate-keys, :host([mode=done]) > section > header > section #done {
        display: block;
      }
      @media only screen and (max-width: _max-width_) {
        :host > section > header > section > div {
          flex-wrap: wrap;
        }
        :host([mode=test]) > section > header > section > div > div:has(> #edge-order) {
          max-width: none;
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
            .card-with-img .private-key-container canvas {
              filter: none;
            }
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
    const pageOneHorizontalAdjust = await this.storageGet('pageOnehorizontaladjust') || 0
    const pageOneVerticalAdjust = await this.storageGet('pageOneverticaladjust') || 0
    const pageTwoHorizontalAdjust = await this.storageGet('pageTwohorizontaladjust') || 0
    const pageTwoVerticalAdjust = await this.storageGet('pageTwoverticaladjust') || 0
    const verifyUrlOriginDefault = 'https://iris-swiss.com/'
    const verifyUrlOrigin = await this.storageGet('verifyUrlOrigin') || verifyUrlOriginDefault
    const producerName = await this.storageGet('producerName') || ''
    const amount = await this.storageGet('amount') || 0.0001
    this.html = /* html */`
      <section>
        <header>
          <dialog id=print-settings>
            <div>
              <img class=long-edge src="./src/img/OYM-printer-settings-long-edge.png" />
              <img class=short-edge src="./src/img/OYM-printer-settings-short-edge.png" />
              <button>continue!</button>
            </div>
          </dialog>
          <a href="?page=/" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
          <h1 class=font-size-h2>Step Two: Generate your key pairs</h1>
          <section>
            <div>
              <div>
                <div>
                  <input id=edge-order ${await this.storageGet('flipOnLongSide') === 'false' ? '' : 'checked'} type=checkbox>
                  <label for=edge-order>Two-sided: Flip on long edge</label>
                </div>
                <hr>
                <div class=card-count>
                  <label for=card-count>Cards to print:</label>
                  <input id=card-count type=number min=1 max=10 value=${await this.storageGet('cardCount') || 10}>
                </div>
              </div>
              <div class=page-setting>
                <h3>Adjust Page ONE position:</h3>
                <div>
                  <label for=page-one-horizontal-adjust>horizontally</label>
                  <input id=page-one-horizontal-adjust type=number value="${pageOneHorizontalAdjust}">
                </div>
                <div>
                  <label for=page-one-vertical-adjust>vertically</label>
                  <input id=page-one-vertical-adjust type=number value="${pageOneVerticalAdjust}">
                </div>
              </div>
              <div class=page-setting>
                <h3>Adjust Page TWO position:</h3>
                <div>
                  <label for=page-two-horizontal-adjust>horizontally</label>
                  <input id=page-two-horizontal-adjust type=number value="${pageTwoHorizontalAdjust}">
                </div>
                <div>
                  <label for=page-two-vertical-adjust>vertically</label>
                  <input id=page-two-vertical-adjust type=number value="${pageTwoVerticalAdjust}">
                </div>
              </div>
              <div>
                <div class=verify-url-origin>
                  <label for=verify-url-origin>Verify URL origin</label>
                  <input id=verify-url-origin type=text placeholder="${verifyUrlOriginDefault}" value="${verifyUrlOrigin}">
                </div>
                <div class=producer-name>
                  <label for=producer-name>Producer nickname</label>
                  <input required id=producer-name type=text value="${producerName}">
                </div>
                <div class=amount>
                  <label for=amount>Amount of bitcoin</label>
                  <input id=amount type=text value="${amount}">
                </div>
              </div>
              <div>
                <button id=print-test-data>test print!</button>
                <button id=skip-test>skip!</button>
              </div>
            </div>
            <button id=generate-keys>Generate keys and print!</button>
            <a id=done href="?page=/test" route target="_self">Next Step: Test matching key pairs!</a>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
        </header>
        <main>
          <h3 class=no-print>Page ONE</h3>
          <div
            class="a4 page-one"
            page-one-horizontal-adjust="${pageOneHorizontalAdjust}"
            page-one-vertical-adjust="${pageOneVerticalAdjust}"
          >
            <div class="cards">
              ${this.renderCard('oym__print_final1.jpg', 5, ['public-key', 'verify-url'])}
            </div>
            <div class="cards">
              ${this.renderCard('oym__print_final1.jpg', 5, ['public-key', 'verify-url'])}
            </div>
          </div>
          <br class=no-print>
          <h3 class=no-print>Page TWO</h3>
          <div
            class="a4 page-two"
            page-two-horizontal-adjust="${pageTwoHorizontalAdjust}"
            page-two-vertical-adjust="${pageTwoVerticalAdjust}"
          >
            <div class="cards">
              ${this.renderCard('oym__print_final2.jpg', 5, ['avatar', 'private-key'])}
            </div>
            <div class="cards">
              ${this.renderCard('oym__print_final2.jpg', 5, ['avatar', 'private-key'])}
            </div>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    const avatarFile = await this.webWorker(Generator.loadFile, await this.storageGet('avatarFileName') || 'avatar.jpg')
    const imgAvatarUrl = URL.createObjectURL(avatarFile)
    this.imgAvatars.forEach(imgAvatar => imgAvatar.src = imgAvatarUrl)
  }

  renderCard (name, length, imgTypes) {
    let result = ''
    for (let index = 0; index < length; index++) {
      result += /* html */`
        <div class=card-with-img>
          <img id=background-two-img src="./src/img/${name}" />
          ${imgTypes.reduce((acc, curr) => /* html */`
            ${acc}
            <div class=${curr}-container>
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

  storageGet (propKey) {
    return new Promise(resolve => this.dispatchEvent(new CustomEvent('storage-get', {
      detail: {
        key: 'printSettings',
        resolve
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))).then(data => data.value[propKey])
  }

  storageMerge (propKey, value) {
    this.dispatchEvent(new CustomEvent('storage-merge', {
      detail: {
        key: 'printSettings',
        value: {
          [propKey]: value
        }
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  #getQrCanvas (text, container) {
    return this.loadDependency('QRCode', `${this.importMetaUrl}../../libs/qrcode.min.js`).then(QRCode => {
      if (!text || text.length > 1264) {
        return container.innerHTML = '<h5>Warning: String too long! The qr code can not be generated...</h5>'
      }
      const canvas = document.createElement('canvas')
      QRCode.toCanvas(canvas, text, {
        margin: 0
      })
      canvas.setAttribute('style', 'height: auto; width: auto; max-height: 100%; max-width: 100%;')
      return canvas
    })
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<any>}
   */
  loadDependency (globalNamespace, url) {
    // make it global to self so that other components can know when it has been loaded
    return this[`_loadDependency${globalNamespace}`] || (this[`_loadDependency${globalNamespace}`] = new Promise((resolve, reject) => {
      // @ts-ignore
      if (document.head.querySelector(`#${globalNamespace}`) || self[globalNamespace]) return resolve(self[globalNamespace])
      const script = document.createElement('script')
      script.setAttribute('id', globalNamespace)
      script.setAttribute('src', url)
      // @ts-ignore
      script.onload = () => self[globalNamespace]
        // @ts-ignore
        ? resolve(self[globalNamespace])
        : reject(new Error(`${globalNamespace} does not load into the global scope!`))
      document.head.appendChild(script)
    }))
  }

  get buttonPrintTestData () {
    return this.root.querySelector('#print-test-data')
  }

  get buttonSkipTest () {
    return this.root.querySelector('#skip-test')
  }

  get flipOnLongSide () {
    return this.root.querySelector('#edge-order')
  }

  get cardCount () {
    return this.root.querySelector('#card-count')
  }

  get inputPageOneHorizontalAdjust () {
    return this.root.querySelector('#page-one-horizontal-adjust')
  }

  get inputPageOneVerticalAdjust () {
    return this.root.querySelector('#page-one-vertical-adjust')
  }

  get inputPageTwoHorizontalAdjust () {
    return this.root.querySelector('#page-two-horizontal-adjust')
  }

  get inputPageTwoVerticalAdjust () {
    return this.root.querySelector('#page-two-vertical-adjust')
  }

  get inputVerifyUrlOrigin () {
    return this.root.querySelector('#verify-url-origin')
  }

  get inputProducerName () {
    return this.root.querySelector('#producer-name')
  }

  get inputAmount () {
    return this.root.querySelector('#amount')
  }

  get dialogPrintSetting () {
    return this.root.querySelector('#print-settings')
  }

  get buttonGenerateKeys () {
    return this.root.querySelector('#generate-keys')
  }

  get cards () {
    return Array.from(this.root.querySelectorAll('.a4')).reduce((acc, page, i) => {
      let cards = Array.from(page.querySelectorAll('.cards > *'))
      // duplex print fix
      if (i === 1) {
        if (this.flipOnLongSide.checked) {
          // Flip on long edge, reverse the second pages all cards
          cards.reverse()
        } else {
          // Flip on short side, reverse the second pages each stack of cards separately
          cards = Array.from(page.querySelectorAll('.cards')).reduce((acc, cardsParent) => [...acc, ...Array.from(cardsParent.children).reverse()], [])
        }
      }
      cards.forEach((card, i) => {
        if (Array.isArray(acc[i])) {
          acc[i].push(card)
        } else {
          acc[i] = [card]
        }
      })
      return acc
    }, [])
  }
}
