import {CuppaComponent, html} from "../../../cuppa/cuppa.component.min.js";
import {SpotifyCtrl} from "../../controller/SpotifyCtrl.js";
import {CuppaStorage, GetStorage} from "../../../cuppa/cuppa.storage.min.js";
import {Storages} from "../../controller/Storages.js";

export class Main extends CuppaComponent{
	deviceId = this.observable('deviceId', '');
	trackUri = this.observable('trackUri', 'spotify:track:4cktbXiXOapiLBMprHFErI');
	playerState = this.observable('playerState');

	mounted(){
		SpotifyCtrl.loadPlayer();
	}

	async playTrack(){

	}

	render(){
		return html`
      <get-storage
        name="${Storages.deviceId.name}"
        store="${Storages.deviceId.store}"
        @change=${(e)=>{ this.deviceId = e.detail; }}
      /></get-storage>
      <get-storage
        name="${Storages.playerState.name}"
        store="${Storages.playerState.store}"
        @change=${(e)=>{ this.playerState = e.detail; }}
      ></get-storage>
			<div class="flex d-column p-x-20 p-y-20 m-0-auto m-w-300" style="gap:10px;">
				${this.deviceId ? html`
						<h2>Spotify Player Is Ready</h2>
            <input
              value="${this.trackUri}"
              @change=${(e)=>{ this.trackUri = e.target.value }}
						/>
						${(!this.playerState || this.playerState?.paused === true) ? html`
              <button @click=${()=>SpotifyCtrl.playTrack(this.trackUri).then()}>Play Sound</button>
						` : html`
              <button @click=${()=>SpotifyCtrl.pauseTrack()}>Pause Sound</button>
						`}
					`
				: html`
          <button @click=${SpotifyCtrl.initPlayer}>Init Player</button>
				`}
        <button @click=${()=>{ SpotifyCtrl.setToken(null)}} >Logout From Spotify</button>
			</div>
		`
	}
}

customElements.define("main-comp", Main);
