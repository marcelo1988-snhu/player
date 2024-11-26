import {CuppaComponent, html} from "../../../cuppa/cuppa.component.min.js";
import {Constant} from "../../controller/Constant.js";
import {cuppa} from "../../../cuppa/cuppa.js";
import {SpotifyCtrl} from "../../controller/SpotifyCtrl.js";

export class Login extends CuppaComponent{
	clientId = this.observable('clientId', '6a5c194a62d3482e8ebc469e5c0fa08e');
	redirectUrl = this.observable('redirectUrl', 'https://www.int-server-one.info/tests/spotify/');

	mounted(){
		let pathData = cuppa.getPathData();
		if(!pathData?.data?.access_token) return;
		SpotifyCtrl.setToken(pathData.data.access_token);
		window.location.href = this.redirectUrl;
	}

	render(){
		return html`
			<div class="flex d-column p-x-20 p-y-20 m-0-auto m-w-300 " style="gap:10px;">
        <label for="redirectUrl">Redirect URL</label>
        <input id="redirectUrl" value="${this.redirectUrl}" @change=${(e)=>{ this.redirectUrl = e.target.value }} />
				<label for="clientId">Client ID</label>
				<input id="clientId" value="${this.clientId}" @change=${(e)=>{ this.clientId = e.target.value }} />
				<button @click=${()=>{ SpotifyCtrl.auth({clientId:this.clientId, redirectUrl:this.redirectUrl}) }} >Login With Spotify</button>
			</div>
		`
	}
}

customElements.define("login-comp", Login);
