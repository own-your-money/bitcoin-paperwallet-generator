// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'

/* global Environment */

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

    // @ts-ignore
    this.footer = `<a href="https://github.com/own-your-money/bitcoin-paperwallet-generator" target="_blank">© OYM / ${Environment.stage} ${Environment.version}</a>`
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
        --height: calc(100svh - 2em);
        display: grid;
        grid-template-areas: "header"
                             "body"
                             "footer";
        grid-template-columns: 100%;
        grid-template-rows: minmax(var(--header-min-height , var(--spacing)), auto) 1fr minmax(var(--footer-min-height, var(--spacing)), auto);
        min-height: var(--min-height, var(--height));
        max-height: var(--height);
        margin: 1em;
        .oym-img {
          width: 12.5em;
        }
        .cards {
          display: flex;
          gap: 1em;
          justify-content: space-between;
        }
        .card {
          align-items: center;
          background-color: white;
          border-radius: 7em;
          display: flex;
          height: calc(50svw - 2em);
          max-height: 50svh;
          justify-content: center;
          width: calc(50svw - 2em);
        }
      }
      :host > section > header {
        grid-area: header;
        text-align: center;
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
          .cards {
            flex-direction: column;
            align-items: center;
          }
          .card {
            border-radius: 3em;
          }
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../event-driven-web-components-prototypes/src/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../event-driven-web-components-prototypes/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../event-driven-web-components-prototypes/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    return this.fetchCSS(styles)
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
          <h1>Welcome to</h1>
          <a href="https://ownyour.money/" target=_blank><img class=oym-img src="./src/img/OYM.png" /></a>
          <br>
          <h3 class=center>ownyour.money</h3>
        </header>
        <main>
          <p class=center><a href=https://github.com/own-your-money/standard target=_blank>before you start -> read the standard!</a></p>
          <hr>
          <div class=cards>
            <a class=card href="?page=/generator" route target="_self">
              <h4><span>👉 Generator</span></h4>
            </a>
            <a class=card href="?page=/test" route target="_self">
              <h4><span>👉 Test</span></h4>
            </a>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
