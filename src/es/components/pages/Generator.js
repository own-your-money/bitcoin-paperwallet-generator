// @ts-check
import Index from './Index.js'
import { getKeyPair, getBitcoinAddress, testKeyPair } from '../../Helpers.js'

/**
* Generator Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
export default class Generator extends Index {
  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    // ********************************************************************
    const keyPair = getKeyPair()
    const keyPairWIF = keyPair.toWIF() // equals privateKey p2wpkh
    const bitcoinAddress = getBitcoinAddress(keyPair.publicKey)
    console.log('test keyPair', testKeyPair(keyPair))
    // ********************************************************************
    this.html = /* html */`
      <section>
        <header>
          <h1>OYM Generator</h1>
          <p class=center>
            <a href="?page=/" route target="_self"><span>👉 back</span></a>
          </p>
          <br>
        </header>
        <main>
          <p>bitcoinAddress: ${bitcoinAddress}</p>
          <p>privateKey: ${keyPairWIF}</p>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
