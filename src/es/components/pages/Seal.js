// @ts-check
import Prerequisite from './Prerequisite.js'

/**
* Seal Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Seal extends Prerequisite {
  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  async renderHTML () {
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/production" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
          <h1 class=font-size-h2>Step: Seal & Stamp all the private keys</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/cut" route target="_self">Next Step: Cut, transfer/charge, sleeve and eyelet punch</a>
          </section>
        </header>
        <main>
          <h3>Immediately seal and stamp all the private keys!</h3>
          <section>
            <ol>
              <li>
                <figure>
                  <img src="./src/img/oym-apply-seal.jpg" alt="Apply seal!" />
                  <figcaption>Apply seal!</figcaption>
                </figure>
              </li>
              <li>
                <figure>
                  <img src="./src/img/oym-stamp.jpg" alt="Stamp with any stamps." />
                  <figcaption>Stamp with any stamps.<br>(Important is, that the stamp covers parts of the seal and parts of the card.)</figcaption>
                </figure>
              </li>
            </ol>
          </section>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
  }
}
