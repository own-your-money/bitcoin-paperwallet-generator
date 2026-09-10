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

    this.buttonGenerateTestDataClickEventListener = event => {
      this.setAttribute('mode', 'test')
      self.localStorage.setItem('inputReverseOrder', this.inputReverseOrder.checked)
      this.cards.forEach((cards, i) => cards.forEach(card => Array.from(card.querySelectorAll('div')).forEach(container => container.textContent = `${Array.from(container.classList).reduce((acc, curr) => (acc = `${acc ? `${acc}, ` : ''}${curr}`, ''))} CARD: ${i}`)))
    }

    this.buttonPrintClickEventListener = event => {
      this.dialogPrintSetting.showModal()
      this.dialogPrintSetting.addEventListener('click', event => {
        self.print()
        this.dialogPrintSetting.close()
      }, {once: true})
    }

    this.buttonSkipClickEventListener = event => this.setAttribute('mode', 'test-success')

    const pageAdjustFunc = (name, value, direction) => {
      const key = `${name}-${direction}-adjust`
      this.root.querySelector(`.${name}`).setAttribute(key, value)
      self.localStorage.setItem(key, value)
    }
    this.inputPageOneHorizontalAdjustChangeEventListener = event => pageAdjustFunc('page-one', event.target.value, 'horizontal')
    this.inputPageOneVerticalAdjustChangeEventListener = event => pageAdjustFunc('page-one', event.target.value, 'vertical')
    this.inputPageTwoHorizontalAdjustChangeEventListener = event => pageAdjustFunc('page-two', event.target.value, 'horizontal')
    this.inputPageTwoVerticalAdjustChangeEventListener = event => pageAdjustFunc('page-two', event.target.value, 'vertical')

    this.inputVerifyUrlOriginChangeEventListener = event => self.localStorage.setItem('verify-url-origin', event.target.value)

    this.inputProducerNameChangeEventListener = event => self.localStorage.setItem('producer-name', event.target.value)

    this.inputAmountChangeEventListener = event => self.localStorage.setItem('amount', event.target.value)

    let generationAvailable = true
    this.buttonGenerateKeysClickEventListener = event => {
      generationAvailable = false
      self.requestAnimationFrame(timeStamp => {
        this.buttonGenerateKeys.textContent = 'Generating...'
        const verifyUrlOrigin =  this.inputVerifyUrlOrigin.value || this.inputVerifyUrlOrigin.getAttribute('placeholder')
        const producerName =  this.inputProducerName.value || 'unknown'
        const amount = this.inputAmount.value || 0.0001
        const printTimeStamp = Date.now()
        self.requestAnimationFrame(timeStamp => {
          this.cards.forEach((cards, i) => {
            const {bitcoinAddress, keyPairWIF} = this.generateKey()
            cards.forEach(card => Array.from(card.querySelectorAll('div')).forEach(container => {
              if (container.classList.contains('verify-url-container')) {
                // TODO: amount print field in container
                container.textContent = `${verifyUrlOrigin}?btc=${amount}&timestamp=${printTimeStamp}&prd=${producerName}#${bitcoinAddress}`
              } else if (container.classList.contains('public-key-container')) {
                container.textContent = `${i}: ${bitcoinAddress}`
              } else if (container.classList.contains('private-key-container')) {
                // TODO: CVC print field in container
                container.textContent = `${i}: ${keyPairWIF}`
              }
            }))
          })
          this.buttonPrintClickEventListener()
          this.buttonGenerateKeys.textContent = 'Generate keys and print!'
          generationAvailable = true
        })
      })
    }

    this.afterprintEventListener = event => {
      if (this.getAttribute('mode') === 'test') {
        if (self.confirm('Did your test data print succeed?')) this.setAttribute('mode', 'test-success')
      } else {
        this.setAttribute('mode', 'done')
      }
    }
  }

  connectedCallback () {
    const result = super.connectedCallback()
    this.buttonGenerateTestDataClickEventListener()
    this.buttonPrintTestData.addEventListener('click', this.buttonPrintClickEventListener)
    this.buttonSkipTest.addEventListener('click', this.buttonSkipClickEventListener)
    this.inputReverseOrder.addEventListener('change', this.buttonGenerateTestDataClickEventListener)
    this.inputPageOneHorizontalAdjust.addEventListener('change', this.inputPageOneHorizontalAdjustChangeEventListener)
    this.inputPageOneVerticalAdjust.addEventListener('change', this.inputPageOneVerticalAdjustChangeEventListener)
    this.inputPageTwoHorizontalAdjust.addEventListener('change', this.inputPageTwoHorizontalAdjustChangeEventListener)
    this.inputPageTwoVerticalAdjust.addEventListener('change', this.inputPageTwoVerticalAdjustChangeEventListener)
    this.inputVerifyUrlOrigin.addEventListener('change', this.inputVerifyUrlOriginChangeEventListener)
    this.inputProducerName.addEventListener('change', this.inputProducerNameChangeEventListener)
    this.inputAmount.addEventListener('change', this.inputAmountChangeEventListener)
    this.buttonGenerateKeys.addEventListener('click', this.buttonGenerateKeysClickEventListener)
    self.addEventListener('afterprint', this.afterprintEventListener)
    return result
  }

  disconnectedCallback () {
    this.buttonPrintTestData.removeEventListener('click', this.buttonPrintClickEventListener)
    this.buttonSkipTest.removeEventListener('click', this.buttonSkipClickEventListener)
    this.inputReverseOrder.removeEventListener('change', this.buttonGenerateTestDataClickEventListener)
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
                  &:where(.verify-url-origin, .producer-name, .amount) {
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
      :host([mode=test-success]) > section > header > section #generate-keys, :host([mode=done]) > section > header > section :is(#done, #generate-keys) {
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
    const pageOneHorizontalAdjust = self.localStorage.getItem('page-one-horizontal-adjust') || 0
    const pageOneVerticalAdjust = self.localStorage.getItem('page-one-vertical-adjust') || 0
    const pageTwoHorizontalAdjust = self.localStorage.getItem('page-two-horizontal-adjust') || 0
    const pageTwoVerticalAdjust = self.localStorage.getItem('page-two-vertical-adjust') || 0
    const verifyUrlOriginDefault = 'https://iris-swiss.com/'
    const verifyUrlOrigin = self.localStorage.getItem('verify-url-origin') || verifyUrlOriginDefault
    const producerName = self.localStorage.getItem('producer-name') || ''
    const amount = self.localStorage.getItem('amount') || 0.0001
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
                <input id=edge-order ${self.localStorage.getItem('inputReverseOrder') === 'false' ? '' : 'checked'} type=checkbox>
                <label for=edge-order>Two-sided: Flip on long edge</label>
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
                  <input id=producer-name type=text value="${producerName}">
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
            <a id=done href="?page=/test" route target="_self">Finally: Test matching key pairs!</a>
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

  get buttonPrintTestData () {
    return this.root.querySelector('#print-test-data')
  }

  get buttonSkipTest () {
    return this.root.querySelector('#skip-test')
  }

  get inputReverseOrder () {
    return this.root.querySelector('#edge-order')
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
        if (this.inputReverseOrder.checked) {
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
