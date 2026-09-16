// @ts-check
import IndexPrototype from './IndexPrototype.js'

/**
* Prerequisite Main/Start Page
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Prerequisite extends IndexPrototype {
  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section > main {
        & > section > ol {
          display: flex;
          align-items: center;
          list-style-position: inside;
          & > li {
            border-bottom: 1px dotted white;
            margin-bottom: 2em;
            width: fit-content;
          }
          figure {
            display: flex;
            flex-direction: column;
            gap: 1em;
            margin: 0;
            > img {
              max-height: 50svh;
              object-fit: contain;
            }
          }
        }
      }
      @media only screen and (max-width: _max-width_) {
        
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
    this.html = /* html */`
      <section>
        <header>
          <a href="?page=/production" route target="_self"><img class=oym-img src="${this.importMetaUrl}../../../img/OYM.png" /></a>
          <h1 class=font-size-h2>Step: Prepare for production</h1>
          <section>
            <div></div>
            <a id=next-step href="?page=/card" route target="_self">Next Step: Cards avatar</a>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
        </header>
        <main>
          <h3>The following items must be available for production!</h3>
          <section>
            <ol>
              <li>A printer which does not cache any print data beyond shutdown. Best to have a COV (certificate of volatility).</li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/a4-200g-paper.png" alt="200g A4 Paper" />
                  <figcaption>200g A4 Paper.</figcaption>
                </figure>
              </li>
              <li>A camera to which this browser session has access.</li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/scratch-stickers-20x20mm.png" alt="20mm x 20mm Scratch Stickers" />
                  <figcaption>20mm x 20mm Scratch Stickers.</figcaption>
                </figure>
              </li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/any-type-of-stamp.png" alt="A Stamp" />
                  <figcaption>A Stamp.</figcaption>
                </figure>
              </li>
              <li>A digital wallet with some Bitcoin balance to transfer/charge the paper wallets.</li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/card-sleeves.png" alt="Card sleeves" />
                  <figcaption>Card sleeves.</figcaption>
                </figure>
              </li>
              <li>
                <figure>
                  <img src="${this.importMetaUrl}../../../img/eyelet-puncher.png" alt="Eyelet puncher" />
                  <figcaption>Eyelet puncher.</figcaption>
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
