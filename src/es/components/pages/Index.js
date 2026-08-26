// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'
import * as bitcoin from 'bitcoinjs-lib'
// @ts-ignore
import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'
// buffer must be global before anything gets loaded
// @ts-ignore
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

/**
* Generator Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
export default class Index extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      tabindex: 'no-tabindex-style',
      ...options
    }, ...args)

    globalThis.Buffer = Buffer
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
  }

  /**
  * evaluates if a render is necessary
  *
  * @return {boolean}
  */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
  * evaluates if a render is necessary
  *
  * @return {boolean}
  */
  shouldRenderHTML () {
    // @ts-ignore
    return !this.section
  }

  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */ `
      :host {
        font-size: var(--font-size, 10px);
        font-weight: var(--font-weight, normal);
        line-height: var(--line-height, normal);
        width: 100%;
        word-break: var(--word-break, normal);
      }
      :host > section {
        display: grid;
        grid-template-areas: "header"
                             "body"
                             "footer";
        grid-template-columns: 100%;
        grid-template-rows: minmax(var(--header-min-height , var(--spacing)), auto) 1fr minmax(var(--footer-min-height, var(--spacing)), auto);
        min-height: var(--min-height, 100svh);
        max-height: 100svh;
      }
      :host > section > header {
        grid-area: header;
      }
      :host > section > body {
        grid-area: body;
      }
      :host > section > footer {
        grid-area: footer;
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          font-size: var(--font-size-mobile, var(--font-size, 10px));
          font-weight: var(--font-weight-mobile, var(--font-weight, normal));
          line-height: var(--line-height-mobile, var(--line-height, normal));
          word-break: var(--word-break-mobile, var(--word-break, normal));
        }
        :host section {
          grid-template-rows: minmax(var(--header-height-mobile, var(--header-height, var(--spacing))), auto) 1fr minmax(var(--footer-min-height-mobile, var(--footer-min-height, var(--spacing))), auto);
        }
      }
    `
    return Promise.resolve()
  }

  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    // ********************************************************************
    const {bitcoinAddress, privateKey} = Index.#generateWallet()
    // ********************************************************************
    this.html = /* html */`
      <section>
        <header>header</header>
        <main>
          <p>bitcoinAddress: ${bitcoinAddress}</p>
          <p>privateKey: ${privateKey}</p>
        </main>
        <footer>footer</footer>
      </section>
    `
    return Promise.resolve()
  }

  static #generateWallet() {
    const keyPair = ECPairFactory(ecc).makeRandom({
      rng: size => {
        // @ts-ignore
        const bytes = new Uint8Array(size)
        crypto.getRandomValues(bytes)
        // randomBytes
        return bytes
      }
    })
    const { address: bitcoinAddress } = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin
    })
    return {
      bitcoinAddress,
      privateKey: keyPair.toWIF(),
      publicKey: Array.from(keyPair.publicKey).map(byte => byte.toString(16).padStart(2, '0')).join('') // bytesToHex
    }
  }
}
