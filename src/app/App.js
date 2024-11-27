import { CuppaComponent, html } from './cuppa/cuppa.component.min.js';
import { SpotifyCtrl } from './controller/SpotifyCtrl.js';
import { CuppaStorage } from './cuppa/cuppa.storage.min.js';

class App extends CuppaComponent {
  playlists = [
    { id: '37i9dQZF1DWU0ScTcjJBdj', name: 'Playlist 1' },
    { id: '0oPyDVNdgcPFAWmOYSK7O1', name: 'Playlist 2' },
    { id: '37i9dQZF1DX0vHZ8elq0UK', name: 'Playlist 3' },
  ];
  
  clientId = '8163d938b9f5451dadd6ba846dc70a0b';
  redirectUrl = 'https://marcelo1988-snhu.github.io/player/callback';

  mounted() {
    const token = CuppaStorage.getDataSync({ name: 'TOKEN', store: CuppaStorage.LOCAL });
    if (!token) {
      this.login();
    } else {
      SpotifyCtrl.setToken(token);
      SpotifyCtrl.loadPlayer();
    }
  }

  login() {
    SpotifyCtrl.auth({ clientId: this.clientId, redirectUrl: this.redirectUrl });
  }

  async playPlaylist(playlistId) {
    const playlistUri = `spotify:playlist:${playlistId}`;
    await SpotifyCtrl.playTrack(playlistUri);
  }

  render() {
    const token = CuppaStorage.getDataSync({ name: 'TOKEN', store: CuppaStorage.LOCAL });
    return html`
      <div style="text-align:center; margin:20px;">
        <h1>Spotify Playlist Player</h1>
        ${!token
          ? html`
              <button @click=${this.login}>Login with Spotify</button>
            `
          : html`
              <div>
                ${this.playlists.map(
                  (playlist) => html`
                    <button
                      style="margin:10px;"
                      @click=${() => this.playPlaylist(playlist.id)}
                    >
                      Play ${playlist.name}
                    </button>
                  `
                )}
              </div>
            `}
      </div>
    `;
  }
}

customElements.define('app-comp', App);
