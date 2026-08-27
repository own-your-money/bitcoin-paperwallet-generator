// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'
import * as bitcoin from 'bitcoinjs-lib'
// @ts-ignore
import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'

/* global Buffer */

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
    const keyPair = Index.#getKeyPair()
    const keyPairWIF = keyPair.toWIF() // equals privateKey
    const bitcoinAddress = Index.#getBitcoinAddress(keyPair.publicKey)
    console.log('test keyPair', Index.#testKeyPair(keyPair))
    // ********************************************************************
    this.html = /* html */`
      <section>
        <header>header</header>
        <main>
          <p>bitcoinAddress: ${bitcoinAddress}</p>
          <p>privateKey: ${keyPairWIF}</p>
        </main>
        <footer>footer</footer>
      </section>
    `
    return Promise.resolve()
  }

  static #getKeyPair() {
    return ECPairFactory(ecc).makeRandom({
      // @ts-ignore
      rng: size => Buffer.from(crypto.getRandomValues(new Uint8Array(size)))
    })
  }

  static #getBitcoinAddress (publicKey) {
    return bitcoin.payments.p2wpkh({
      pubkey: publicKey,
      network: bitcoin.networks.bitcoin
    }).address || false
  }

  static #testKeyPair (keyPair) {
    const tests = {}
    // test privateKey toWIF + fromWIF
    const keyPairFromWIF = ECPairFactory(ecc).fromWIF(keyPair.toWIF()/* equals privateKey */, bitcoin.networks.bitcoin)
    // @ts-ignore
    tests.toFromWIF = Buffer.from(keyPairFromWIF.privateKey).equals(Buffer.from(keyPair.privateKey))
    // test publicKey pointFromScalar
    const derivedPubkey = ecc.pointFromScalar(keyPairFromWIF.privateKey, true)
    // @ts-ignore
    tests.pointFromScalar = Buffer.from(derivedPubkey).equals(Buffer.from(keyPair.publicKey))
    // test bitcoinAddress matches privateKey
    const bitcoinAddress = Index.#getBitcoinAddress(keyPair.publicKey)
    // @ts-ignore
    tests.p2wpkh = bitcoinAddress === Index.#getBitcoinAddress(Buffer.from(derivedPubkey)) && bitcoinAddress === Index.#getBitcoinAddress(keyPairFromWIF.publicKey)
    if (Object.keys(tests).every(key => tests[key])) return {...tests, result: true}
    return {...tests, error: new Error('Some tests did not pass!'), result: false}
  }
}
