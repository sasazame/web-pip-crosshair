# PiP Reticle

Picture-in-Pictureウィンドウにレティクルを表示する、依存関係なしの静的Webツールです。

https://sasazame.github.io/web-pip-crosshair/

## ローカルで確認

`index.html`を直接開くか、任意の静的Webサーバーで配信します。

```sh
python3 -m http.server 8080
```

その後、<http://localhost:8080> を開いてください。PC版Chrome / Edgeを推奨します。

## GitHub Pagesで公開

1. このディレクトリをGitHubリポジトリへpushします。
2. GitHubの **Settings → Pages** を開きます。
3. **Build and deployment → Source** で **GitHub Actions** を選びます。
4. `main`ブランチへのpush後、Actionsが完了すると公開されます。

## 制約

- ブラウザのPiPは常に前面表示できますが、ウィンドウ全体を透明にはできません。
- PiPウィンドウはクリックを背面へ透過しません。
- iOSなど、一部環境ではCanvas由来のPiPが利用できません。
- ゲームやサービスの利用規約に従って使用してください。
