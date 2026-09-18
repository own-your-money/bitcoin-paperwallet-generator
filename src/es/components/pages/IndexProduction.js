// @ts-check
import IndexPrototype from './IndexPrototype.js'

/* global Environment */

/**
* Generator Main/Start Page
*
* @export
* @class IndexProduction
* @type {CustomElementConstructor}
*/
export default class IndexProduction extends IndexPrototype {
  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host {
        --h4-word-break: break-word;
      }
      :host > section .cards.overview .card {
        width: calc(25cqw - 0.75em);
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
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/" route target="_self"><img class=oym-img src="${this.importMetaUrl}../../../img/OYM.png" /></a>
          <h1>Welcome to</h1>
          <a href="https://ownyour.money/" target=_blank><h3 class=center>ownyour.money</h3></a>
          <p class=center><a href=https://github.com/own-your-money/standard target=_blank>👉 before you start -> read the standard!</a></p>
        </header>
        <main>
          <hr>
          <div class="cards overview">
            <a class=card href="?page=/prerequisite" route target="_self" title="necessary preparation">
              <h4><span>Prerequisite</span></h4>
            </a>
            <a class=card href="?page=/card" route target="_self" title="start printing">
              <h4><span>Print!</span></h4>
            </a>
            <a class=card href="?page=/test" route target="_self" title="test your print key pairs">
              <h4><span>Test key pairs!</span></h4>
            </a>
            <a class=card href="?page=/buy" route target="_self" title="buy bitcoin">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-coin-bitcoin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4 2.66a1 1 0 0 0 -1 1h-1a1 1 0 0 0 -2 0a1 1 0 1 0 0 2v6a1 1 0 0 0 0 2c0 1.333 2 1.333 2 0h1a1 1 0 0 0 2 0v-.15c1.167 -.394 2 -1.527 2 -2.85l-.005 -.175a3.063 3.063 0 0 0 -.734 -1.827c.46 -.532 .739 -1.233 .739 -1.998c0 -1.323 -.833 -2.456 -2 -2.85v-.15a1 1 0 0 0 -1 -1zm.09 7c.492 0 .91 .437 .91 1s-.418 1 -.91 1h-2.09v-2h2.09zm0 -4c.492 0 .91 .437 .91 1c0 .522 -.36 .937 -.806 .993l-.104 .007h-2.09v-2h2.09z" /></svg>
              </h4>
            </a>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
