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
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
          <h1>Welcome to</h1>
          <a href="https://ownyour.money/" target=_blank><h3 class=center>ownyour.money</h3></a>
          <p class=center><a href=https://github.com/own-your-money/standard target=_blank>👉 before you start -> read the standard!</a></p>
        </header>
        <main>
          <hr>
          <div class="cards overview">
            <a class=card href="?page=/prerequisite" route target="_self">
              <h4><span>Prerequisite</span></h4>
            </a>
            <a class=card href="?page=/card" route target="_self">
              <h4><span>Print!</span></h4>
            </a>
            <a class=card href="?page=/test" route target="_self">
              <h4><span>Test key&nbsp;pairs!</span></h4>
            </a>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
