// @ts-check
import Prerequisite from './Prerequisite.js'

/**
* Cut Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Cut extends Prerequisite {
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
          <h1 class=font-size-h2>Step: Cut, transfer/charge bitcoins, sleeve and eyelet punch each card</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/production" route target="_self">All done!</a>
          </section>
        </header>
        <main>
          <h3>Finalize the cards by cutting, charging, sleeving and eyelet punching each of them.</h3>
          <section>
            <ol>
              <li>Cut cards.</li>
              <li>Transfer the printed amount of Bitcoin to the public key of each card. Charging them accordingly from any digital wallet.</li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/oym-sleeve.jpg" alt="Put the card into the card sleeve." />
                  <figcaption>Put the card into the card sleeve.</figcaption>
                </figure>
              </li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/oym-eyelet-punch.jpg" alt="Eyelet punch the card!" />
                  <figcaption>Eyelet punch the card! From the "Verify now" (front) side.</figcaption>
                </figure>
              </li>
              <li>Scan "Verify now" and confirm the amount at blockchain.com</a>
            </ol>
            <h3>Result</h3>
            <figure>
              <img src="${this.importMetaUrl}../../../img/oym-final-1.jpg" alt="Final result front" />
              <figcaption>Final result front</figcaption>
            </figure>
            <figure>
              <img src="${this.importMetaUrl}../../../img/oym-final-2.jpg" alt="Final result back" />
              <figcaption>Final result back</figcaption>
            </figure>
          </section>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
  }
}
