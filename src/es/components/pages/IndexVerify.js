// @ts-check
import IndexPrototype from './IndexPrototype.js'

/* global Environment */

/**
* Generator Main/Start Page
*
* @export
* @class IndexVerify
* @type {CustomElementConstructor}
*/
export default class IndexVerify extends IndexPrototype {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      tabindex: 'no-tabindex-style',
      ...options
    }, ...args)

    // @ts-ignore
    this.footer = `<a href="?page=/" target="_self" route>© OYM / ${Environment.stage} ${Environment.version} - print your own paper wallet(s)! ${this.printerSvg}</a>`
  }
  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section {
        --h-word-break-mobile: break-word;
        & > main {
          --h4-font-size: 0.75em;
          & > :where(h3, h4) > span {
            text-decoration: underline
          }
          .balance {
            display: flex;
            align-items: center;
            text-align: right;
            gap: 0.25em;
            > span {
              text-decoration: underline;
            }
          }
          .cards.overview > .card {
            width: calc(33.33cqw - 0.6666em);
            svg {
              height: auto;
              min-width: 1.75em;
            }
            span.icon {
              font-size: 1.75em;
              text-decoration: none;
            }
          }
        }
      }
      @media only screen and (max-width: _max-width_) {
        :host > section > main .cards.overview > .card {
          height: 10em;
        }
        :host > section {
          & > main {
            .cards.overview > .card {
              width: 100%;
            }
          }
        }
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
        </header>
        <main>
          <hr>
          <h3><span class=font-size-tiny>Produced by:</span><br>${url.searchParams.get('prd')} at ${(new Date(Number(url.searchParams.get('ts')))).toLocaleString(navigator.language)}</h3>
          <h4><span class=font-size-tiny>public key:</span><br>${bitcoinAddress}</h4>
          <h2 class=font-size-h3><span class=font-size-tiny>Alleged paper wallet balance:</span><br><a class=font-size-h3 title="click to verify amount with blockchain.com" href="${verifyUrl}" target="_blank">
            ${url.searchParams.get('amt')}&nbsp;${url.searchParams.get('cur')?.toUpperCase()}</a>
          </h2>
          <hr>
          <div class="cards overview">
            <a class=card href="${verifyUrl}" target="_blank" title="verify your BTC balance at blockchain.com">
              <h4 class=balance><span class=icon>👉</span><span>verify BALANCE</span></h4>
            </a>
            <a class=card href="?page=/sweep" target="_blank" title="how to withdraw your paper wallets balance">
              <h4 class=balance>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-transaction-bitcoin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 12h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" /><path d="M16 16h4" /><path d="M16 11v10v-9" /><path d="M19 11v1" /><path d="M19 20v1" /><path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 5h8" /><path d="M7 5v8a3 3 0 0 0 3 3h1" /></svg>
                withdraw
              </h4>
            </a>
            <a title="visit a unique decentral ninja chat room, specifically tailored for this cards public key" class=card href="https://decentral.ninja/?page=%2Fchat&websocket-url=wss%3A%2F%2Fheroku.decentral.ninja%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket.peerweb.site%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket-two.peerweb.site%2F%3Fkeep-alive%3D432000000&webrtc-url=wss%3A%2F%2Fwebrtc-two.peerweb.site%2F%2Cwss%3A%2F%2Fwebrtc.peerweb.site%2F%2Cwss%3A%2F%2Fwebrtc-trystero.ninja%2F&room=chat-oym-${bitcoinAddress}" target="_blank">
              <h4 class=balance>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-wechat" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5z"></path>
                  <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233"></path>
                  <path d="M10 8h.01"></path>
                  <path d="M7 8h.01"></path>
                  <path d="M15 14h.01"></path>
                  <path d="M18 14h.01"></path>
                </svg>pub-key-chat
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
