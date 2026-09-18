// @ts-check
import IndexVerify from './IndexVerify.js'

/* global Environment */

/**
* Generator Main/Start Page
*
* @export
* @class Sweep
* @type {CustomElementConstructor}
*/
export default class Sweep extends IndexVerify {
  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section > main img {
        max-height: 75dvh;
        max-width: 100%;
      }
    `
    return result
  }

  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    const url = new URL(location.href)
    const bitcoinAddress = location.hash.replace('#', '')
    const verifyUrl = `https://www.blockchain.com/explorer/addresses/btc/${bitcoinAddress}`
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/" route target="_self"><img class=oym-img src="${this.importMetaUrl}../../../img/OYM.png" /></a>
          <h1>Private Key sweep</h1>
          <h2 class=font-size-tiny>aka. withdrawal of paper wallet</h2>
        </header>
        <main>
          <hr>
          <h3>Scratch to reveal your private key</h3>
          <div class=center><img src="${this.importMetaUrl}../../../img/scratch-private-wif-key.jpg" alt="Scratch the sticker with a coin!" /></div>
          <hr>
          <a href="https://electrum.org/" target=_blank><h2>Electrum</h2></a>
          <h3>Installation:</h3>
          <p class=center>Windows, macOS, Linux desktop, or Android. <a href="https://electrum.org/#download" target=_blank>Download Electrum</a>.</p>
          <h3>Sweep:</h3>
          <p class=center>Open your wallet and select <span class=bold>Wallet → Private Keys → Sweep</span>. Enter or scan the paper wallet's private key, choose the destination, review the fee, and broadcast.<br><a href="https://bitcoinelectrum.com/importing-your-private-keys-into-electrum/" target=_blank>Detailed sweep instructions</a></p>
          <hr>
          <a href="https://sparrowwallet.com/" target=_blank><h2>Sparrow Wallet</h2></a>
          <h3>Installation:</h3>
          <p class=center>Windows, macOS, or Linux desktop. <a href="https://sparrowwallet.com/download/" target=_blank>Download Sparrow</a>.</p>
          <h3>Sweep:</h3>
          <p class=center>Open Sparrow and use the <span class=bold>Tools → Sweep WIF Private Key</span> function. Enter the paper wallet's private key, select the destination, review the fee, and broadcast.</p>
          <hr>
          <a href="https://legacy.kraken.com/" target=_blank><h2>Kraken Legacy</h2></a>
          <h3>Installation:</h3>
          <p class=center>None — browser-based. A verified Kraken account is required.</p>
          <h3>Recovery:</h3>
          <p class=center>Enter the paper wallet's private key and start <span class=bold>Scan &amp; Recovery</span>. Kraken scans for supported BTC and transfers recovered funds to your Kraken account. <span class=bold>Best suited for balances of ~0.001 BTC or more</span>, as the minimum recovery fee can make smaller amounts uneconomical.<br><a href="https://support.kraken.com/in/articles/kraken-legacy" target=_blank>Detailed Kraken Legacy instructions</a></p>
          <hr>
          <p>There are many more wallets, like cake wallet, which should support private key sweeping... Please, open a <a href="https://github.com/own-your-money/bitcoin-paperwallet-generator/issues" target=_blank>Pull Request on Github</a> to add other recovery options.</p>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
