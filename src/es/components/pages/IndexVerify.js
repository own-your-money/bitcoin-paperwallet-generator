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
  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section{
        --h-word-break-mobile: break-word;
        & > main {
          .balance {
            display: flex;
            align-items: center;
            text-align: right;
            gap: 0.25em;
            > span {
              text-decoration: underline
            }
          }
          .cards.overview > .card {
            width: calc(50cqw - 1em);
            svg {
              height: auto;
              width: 5em;
            }
          }
        }
      }
      @media only screen and (max-width: _max-width_) {
        :host > section > main .cards.overview > .card {
          height: 10em;
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
          <a href="?page=/" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
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
            <a title="verify amount with blockchain.com" class=card href="${verifyUrl}" target="_blank">
              <h4 class=balance>👉 <span>verify BALANCE</span></h4>
            </a>
            <a title="visit a unique decentral ninja chat room, specifically tailored for this cards public key" class=card href="https://decentral.ninja/?page=%2Fchat&websocket-url=wss%3A%2F%2Fheroku.decentral.ninja%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket.peerweb.site%2F%3Fkeep-alive%3D432000000%2Cwss%3A%2F%2Fwebsocket-two.peerweb.site%2F%3Fkeep-alive%3D432000000&webrtc-url=wss%3A%2F%2Fwebrtc-two.peerweb.site%2F%2Cwss%3A%2F%2Fwebrtc.peerweb.site%2F%2Cwss%3A%2F%2Fwebrtc-trystero.ninja%2F&room=chat-oym-${bitcoinAddress}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-wechat" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5z"></path>
                <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233"></path>
                <path d="M10 8h.01"></path>
                <path d="M7 8h.01"></path>
                <path d="M15 14h.01"></path>
                <path d="M18 14h.01"></path>
              </svg>
            </a>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    return Promise.resolve()
  }
}
