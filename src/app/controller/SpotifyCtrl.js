import { CuppaStorage } from "../../cuppa/cuppa.storage.min.js";
import { Storages } from "./Storages.js";
import { Constant } from "./Constant.js";
import { wait } from "../../cuppa/cuppa.js";

export class SpotifyCtrl {
  static auth({ clientId, redirectUrl }) {
    const scope = Constant.SPOTIFY_SCOPE;
    let logInUri =
      `https://accounts.spotify.com/authorize` +
      `?client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
      `&scope=${encodeURIComponent(scope.join(" "))}` +
      `&show_dialog=true`;
    window.open(logInUri, "_self");
  }

  static async api(action, { body = {} } = {}) {
    const token = SpotifyCtrl.getToken();
    let headers = new Headers({ Authorization: "Bearer " + token });
    let result;
    let content;
    try {
      result = await fetch(`https://api.spotify.com/v1/${action}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers,
      });
      content = await result.json();
    } catch (e) {
      console.error("Error with Spotify API call:", e);
      content = null;
    }
    return { content, result };
  }

  static setToken(token) {
    CuppaStorage.setDataSync({ ...Storages.token, data: token });
  }

  static getToken() {
    return CuppaStorage.getDataSync({ ...Storages.token });
  }

  static loadPlayer() {
    window.onSpotifyWebPlaybackSDKReady = SpotifyCtrl.onSpotifyWebPlaybackSDKReady;
    const script = document.createElement("script");
    script.src = `https://sdk.scdn.co/spotify-player.js`;
    document.body.append(script);
  }

  static onSpotifyWebPlaybackSDKReady() {
    console.log("--> SpotifyWebPlaybackSDKReady");
  }

  static initPlayer() {
    const device = cuppa.browser();
    const token = SpotifyCtrl.getToken();
    const player = new Spotify.Player({
      name: `Player ${device.browser} ${device.os}`,
      getOAuthToken: (cb) => {
        cb(`${token}`);
      },
      volume: 0.5,
    });

    player.addListener("ready", ({ device_id }) => {
      CuppaStorage.setDataSync({ ...Storages.deviceId, data: device_id });
      console.log("Ready with Device ID", device_id);
    });

    player
      .connect()
      .then((success) => {
        if (!success) return;
        console.log("The Web Playback SDK successfully connected to Spotify!");
      })
      .catch((error) => {
        console.log(error);
      });

    player.addListener("player_state_changed", (data) => {
      CuppaStorage.setDataSync({ ...Storages.playerState, data });
    });

    player.activateElement().then();
    window.player = player;
  }

  static async playTrack(uri) {
    const player = window.player;
    if (!player) return;
    await player.activateElement();
    const deviceId = CuppaStorage.getDataSync(Storages.deviceId);
    const url = `me/player/play/?device_id=${deviceId}`;
    const body = { uris: [uri] };
    let response = await SpotifyCtrl.api(url, { body });
    if (!response?.content?.error) return;

    await wait(500);
    response = await SpotifyCtrl.api(url, { body });
    if (!response?.content?.error) return;

    await wait(500);
    await SpotifyCtrl.api(url, { body });
  }

  static pauseTrack() {
    const player = window.player;
    if (!player) return;
    player.pause();
  }
}
