// @ts-check
import Prerequisite from './Prerequisite.js'

/**
* Buy Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Buy extends Prerequisite {
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
          <h1 class=font-size-h2>Step: Buy Bitcoin</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/cut" route target="_self">Next Step: Cut, transfer/charge, sleeve and eyelet punch</a>
          </section>
        </header>
        <main>
          <p class=center>site under construction... check back later! Or search your own bitcoin broker. There are P2P brokers as well as mainstream brokers.</p>
          <div class=center>
            <svg xmlns="http://www.w3.org/2000/svg" width="35%" height="auto" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-coin-bitcoin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4 2.66a1 1 0 0 0 -1 1h-1a1 1 0 0 0 -2 0a1 1 0 1 0 0 2v6a1 1 0 0 0 0 2c0 1.333 2 1.333 2 0h1a1 1 0 0 0 2 0v-.15c1.167 -.394 2 -1.527 2 -2.85l-.005 -.175a3.063 3.063 0 0 0 -.734 -1.827c.46 -.532 .739 -1.233 .739 -1.998c0 -1.323 -.833 -2.456 -2 -2.85v-.15a1 1 0 0 0 -1 -1zm.09 7c.492 0 .91 .437 .91 1s-.418 1 -.91 1h-2.09v-2h2.09zm0 -4c.492 0 .91 .437 .91 1c0 .522 -.36 .937 -.806 .993l-.104 .007h-2.09v-2h2.09z" /></svg>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
  }
}
