# All-on-4 情報サイト

All-on-4（オールオン4）治療に関する総合情報サイトです。

## 🚀 デプロイ状況

このプロジェクトはVercelでホスティングする準備が整っています。

### デプロイ方法

1. **Vercelアカウントでログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **新規プロジェクトをインポート**
   - https://vercel.com/new へアクセス
   - 「Import Git Repository」をクリック
   - `hateniri/all-on-4` を選択

3. **デプロイ設定**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 「Deploy」をクリック

4. **デプロイ完了**
   - 通常1-2分でデプロイが完了します
   - https://all-on-4.vercel.app でアクセス可能になります

## 📁 プロジェクト構成

```
all-on-4/
├── index.html          # トップページ
├── columns/            # コラム記事（Markdown）
├── reviews/            # 病院レビュー（Markdown）
├── data/              # 病院データ（YAML）
├── css/               # スタイルシート
├── js/                # JavaScript
├── scripts/           # ビルドスクリプト
└── vercel.json        # Vercel設定
```

## 🛠 ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 📝 コンテンツ更新

1. `columns/` に新しいMarkdownファイルを追加
2. `git add .` && `git commit -m "Add new article"`
3. `git push` でGitHubにプッシュ
4. Vercelが自動的に再デプロイ

## 🔧 技術スタック

- 静的サイトジェネレーター（カスタムビルド）
- Markdown → HTML変換
- Vercelホスティング
- GitHub Actions（週次自動更新）

## 📞 お問い合わせ

サイトに関するお問い合わせは、GitHubのIssuesでお願いします。