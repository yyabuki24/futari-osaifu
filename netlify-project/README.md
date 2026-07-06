# ふたりのおさいふ - GitHub + Netlify デプロイ手順（完全版）

このzipの中身を、GitHub → Netlifyの順で設定していきます。
このzipの中身が最新版（アイコン・スクロールのぶれ修正 込み）です。

---

## 手順1: リポジトリを作る

1. https://github.com を開き、ログインする
2. 画面右上の「+」マークをクリック →「New repository」をクリック
3. 「Repository name」に好きな名前を入力する（例: `futari-osaifu`）
4. 下の方の「Public」が選ばれていることを確認する（Privateでも動きますが、Publicのままで問題ありません）
5. 他の項目は何もチェックせず、そのまま一番下の緑色の「Create repository」ボタンをクリック

これでリポジトリ（保管フォルダ）ができました。

---

## 手順2: ファイルをアップロードする

1. リポジトリを作成すると出てくるページの中に
   「…or uploading an existing file」というリンクがあります。これをクリック
   - もし見つからない場合は、画面上部の「Add file」→「Upload files」でも同じ画面になります
2. パソコンでこのzipを解凍（ダブルクリックすれば解凍されます）
3. 解凍してできたフォルダの中身を**全部まとめて**、ブラウザの点線の枠の中にドラッグ&ドロップする
   - 中身: `index.html`、`manifest.json`、`package.json`、`netlify.toml`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`、`favicon.png`、`netlify`フォルダ
   - **フォルダを丸ごとドラッグ**すればOKです（1つずつやる必要はありません）
   - 「netlify」フォルダの中に「functions」フォルダ、その中に「kv.js」が入っている構造を崩さないようにしてください
4. アップロードが完了すると、ファイル一覧が画面に表示されます
5. 一番下までスクロールし、緑色の「Commit changes」ボタンをクリック

アップロードが終わったら、リポジトリのトップページで `index.html` が一覧の一番上の階層に直接見えているか確認してください（フォルダの中に入っていないこと）。

---

## 手順3: Netlifyと連携する

1. https://app.netlify.com を開き、ログインする
2. 「Add new site」（または「Add new project」）→「Import an existing project」をクリック
3. 「Deploy with GitHub」を選ぶ
4. GitHubとの連携を許可する（初回のみ）
5. 一覧から、手順1で作ったリポジトリ（例: `futari-osaifu`）を選ぶ
6. ビルド設定の画面が出ますが、何も変更せずそのまま「Deploy site」をクリック

1〜2分待つと、新しいURL（例: `〇〇〇.netlify.app`）が発行されます。

---

## 手順4: 今までのURLをやめて、新しいURLに切り替える

今の `curious-cupcake-7e8b86.netlify.app` は「Netlify Drop」という別の方法で作られたサイトなので、今回作るGitHub連携のサイトとは別物（新しいURL）になります。

- 今まで使っていたURLは使えなくなりますが、新しく発行されたURLを今後使ってください
- 新しいURLも、Netlifyのサイト設定の「Site configuration」→「Change site name」から、好きな名前（例: `futari-osaifu.netlify.app`）に変更できます

---

## 完成後の確認

新しいURLをスマホで開いて、下にスクロールしてもヘッダーがぶれないこと、右下の「＋」ボタンで記録を追加して保存できることを確認してください。

問題があれば、どの画面で・どんな表示が出たか（スクリーンショットがあれば一番早いです）教えてください。
