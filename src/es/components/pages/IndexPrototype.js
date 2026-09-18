// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'

/* global Environment */

/**
* Generator Main/Start Page
*
* @export
* @class IndexPrototype
* @type {CustomElementConstructor}
*/
export default class IndexPrototype extends Shadow() {
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
    return Promise.all(showPromises).then(() => {
      this.hidden = false
      this.root.querySelector('header > *:last-child').scrollIntoView()
    })
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
      :host > section > header > section {
        border: 1px solid var(--a-color);
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
        padding: 1em;
        justify-content: space-between;
        align-items: center;
      }
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
          container-type: inline-size;
          &.single {
            justify-content: center;
          }
          &.overview {
            --h4-margin: 0;
            --a-color: var(--background-color);
            flex-wrap: wrap;
            .card {
              padding: 1em;
              height: auto;
              font-size: 3cqw;
              width: calc(33.33cqw - 0.6666em);
              min-height: 9em;
              svg {
                height: auto;
                width: 4em;
                max-height: 250px;
              }
            }
          }
        }
        .card {
          --a-text-decoration: none;
          align-items: center;
          background-color: lightsteelblue;
          border-radius: 0.55cqw;
          display: flex;
          height: calc(50cqw - 0.5em);
          max-height: 50svh;
          justify-content: center;
          width: calc(50cqw - 0.5em);
          font-size: 5cqw;
        }
      }
      :host > section > header {
        grid-area: header;
        text-align: center;
        max-height: 40svh;
        overflow: auto;
      }
      :host > section > main {
        grid-area: body;
        overflow: auto;
      }
      :host > section > footer {
        padding-top: 1em;
        grid-area: footer;
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          font-size: var(--font-size-mobile, var(--font-size, 10px));
          font-weight: var(--font-weight-mobile, var(--font-weight, normal));
          line-height: var(--line-height-mobile, var(--line-height, normal));
          word-break: var(--word-break-mobile, var(--word-break, normal));
        }
        :host > section {
          & > main {
            .cards{
              flex-direction: column;
              align-items: center;
              &.overview > .card {
                width: 100%;
              }
            }
          }
        }
      }
      @media print {
        :host {
          --h-display: none;
        }
        header, footer, .no-print {
          display: none;
        }
        @page {
          size: A4 landscape;
          margin: 0;
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

  get section () {
    return this.root.querySelector('section')
  }

  get printerSvg () {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-printer"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" /><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" /><path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4" /></svg>'
  }
}
