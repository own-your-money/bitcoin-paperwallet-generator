// @ts-check
import Index from './Index.js'
import { WebWorker } from '../../event-driven-web-components-prototypes/src/WebWorker.js'

/**
* Card Main/Start Page
*
  async function listAllOPFSFiles(dirHandle, path = "") {
    for await (const [name, handle] of dirHandle.entries()) {
      const fullPath = path + name;

      if (handle.kind === "file") {
        console.log("file:", fullPath);
      } else if (handle.kind === "directory") {
        console.log("dir:", fullPath + "/");
        await listAllOPFSFiles(handle, fullPath + "/");
      }
    }
  }
  // Entry point
  async function logOPFS() {
    const root = await navigator.storage.getDirectory();
    await listAllOPFSFiles(root);
  }
  logOPFS();
  /////////////clear all////////////////////////////////////////////////////////////
  const root = await navigator.storage.getDirectory();

  for await (const name of root.keys()) {
    await root.removeEntry(name, { recursive: true }); // recursive handles subdirectories too
  }
* @export
* @class Index
* @type {CustomElementConstructor}
*/
// @ts-ignore
export default class Card extends WebWorker(Index) {
  constructor (options, ...args) {
    super(options, ...args)

    this.inputAvatarChangeEventListener = async event => {
      const file = this.inputAvatar.files?.[0]
      if (!file) {
        this.removeAttribute('has-avatar')
        return
      }
      this.setAttribute('has-avatar', '')
      this.imgAvatar.src = URL.createObjectURL(file)
      this.imgAvatar.scrollIntoView()
      const fileName = file.name.replace(/.*(\.[^.]+)$/, 'avatar$1')
      this.webWorker(Card.saveFile, fileName, await file.arrayBuffer())
      self.localStorage.setItem('avatarFileName', fileName)
    }
  }

  connectedCallback () {
    const result = super.connectedCallback()
    if (this.inputAvatar) this.inputAvatar.addEventListener('change', this.inputAvatarChangeEventListener)
    return result
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    if (this.inputAvatar) this.inputAvatar.removeEventListener('change', this.inputAvatarChangeEventListener)
  }

  /**
  * renders the css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    const result = super.renderCSS()
    this.css = /* css */ `
      :host > section > header > section {
        border: 1px solid var(--a-color);
        display: flex;
        gap: 1em;
        padding: 1em;
        justify-content: space-between;
        align-items: center;
      }
      :host > section > main {
        :where([id^=background-]) {
          aspect-ratio: 709 / 1075; /* 5.7cm / 8.65cm */
          width: 100%;
        }
        .card-with-img {
          width: calc(50cqw - 0.5em);
          position: relative;
          container-type: inline-size;
          & > div {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid black;
            border-radius: 1.55cqw;
            padding: 0.15em;
            text-align: center;
            font-size: 0.75em;
            border-color: red;
            color: red;
          }
          .avatar-container {
            left: 12.5cqw;
            bottom: 18%;
            width: 23cqw;
            height: 23cqw;
            .img {
              max-width: 100%;
              max-height: 100%;
              border-radius: 1.55cqw;
            }
          }
          .private-key-container {
            left: 55.25cqw;
            bottom: 35.25%;
            width: 30cqw;
            height: 30cqw;
          }
          .public-key-container {
            left: 69.5cqw;
            bottom: 71.5%;
            width: 12.5cqw;
            height: 14.5cqw;
            font-size: 0.4em;
          }
          .verify-url-container {
            left: 37.5cqw;
            bottom: 20.5%;
            width: 38cqw;
            height: 34.5cqw;
          }
        }
      }
      :host #next-step {
        display: none;
      }
      :host([has-avatar]) #next-step {
        display: block;
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
          <a href="?page=/" route target="_self"><img class=oym-img src="./src/img/OYM.png" /></a>
          <h1 class=font-size-h2>Step One: Upload your cards avatar</h1>
          <section>
            <input type="file" id="avatar" accept="image/*">
            <a id=next-step href="?page=/generator" route target="_self">Next Step: Generator</a>
          </section>
          <br>
          <p class=center><a href=https://github.com/own-your-money/standard/blob/main/SPECIFICATIONS/print.md target=_blank>👉 read the print procedure!</a></p>
          <br>
        </header>
        <main>
          <div class="cards single">
            <div class=card-with-img>
              <img id=background-two-img src="./src/img/oym__print_final2.jpg" />
              <div class=avatar-container>
                <img class="img avatar" />
              </div>
              <div class=private-key-container>placeholder private key</div>
            </div>
            <div class=card-with-img>
              <img id=background-one-img src="./src/img/oym__print_final1.jpg" />
              <div class=public-key-container>placeholder public key</div>
              <div class=verify-url-container>placeholder verify url</div>
            </div>
          </div>
        </main>
        <footer>${this.footer}</footer>
      </section>
    `
    const avatarFile = await this.webWorker(Card.loadFile, self.localStorage.getItem('avatarFileName') || 'avatar.jpg')
    if (avatarFile) {
      this.imgAvatar.src = URL.createObjectURL(avatarFile)
      this.imgAvatar.scrollIntoView()
      this.setAttribute('has-avatar', '')
    } else {
      this.removeAttribute('has-avatar')
    }
  }

  static async saveFile (name, buffer) {
    // @ts-ignore
    const accessHandle = await (await (await navigator.storage.getDirectory()).getFileHandle(name, { create: true })).createSyncAccessHandle()
    accessHandle.write(buffer, { at: 0 })
    accessHandle.flush()
    accessHandle.close()
  }

  static async loadFile (name) {
    try {
      // @ts-ignore
      const accessHandle = await (await (await navigator.storage.getDirectory()).getFileHandle(name)).createSyncAccessHandle()
      const buffer = new Uint8Array(accessHandle.getSize())
      accessHandle.read(buffer, { at: 0 })
      accessHandle.close()
      return new File([buffer], name)
    } catch (error) {
      return null
    }
  }

  get inputAvatar () {
    return this.root.querySelector('#avatar')
  }

  get imgAvatar () {
    return this.root.querySelector('.img.avatar')
  }

  get imgAvatars () {
    return Array.from(this.root.querySelectorAll('.img.avatar'))
  }
}
