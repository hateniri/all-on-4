# Vercel + GitHub デプロイ手順

## 前提条件
- GitHubアカウント
- Vercelアカウント（GitHubでサインアップ推奨）
- Node.js環境（ローカル開発用）

## 1. GitHubへのプッシュ

```bash
# リポジトリの初期化（完了済み）
git init
git remote add origin https://github.com/hateniri/all-on-4.git

# 初回コミット
git add .
git commit -m "Initial commit: All-on-4 information site"

# GitHubへプッシュ
git branch -M main
git push -u origin main
```

## 2. Vercelでのデプロイ

### 方法1: Vercel CLIを使用（推奨）

```bash
# Vercel CLIのインストール
npm i -g vercel

# プロジェクトディレクトリで実行
vercel

# 以下の質問に答える：
# - Set up and deploy? → Y
# - Which scope? → 自分のアカウントを選択
# - Link to existing project? → N（新規の場合）
# - Project name? → all-on-4
# - In which directory is your code? → ./
# - Override settings? → N
```

### 方法2: Vercel Webダッシュボード

1. https://vercel.com/new にアクセス
2. 「Import Git Repository」をクリック
3. GitHubアカウントを連携
4. `hateniri/all-on-4` リポジトリを選択
5. 以下の設定を確認：
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 「Deploy」をクリック

## 3. ビルド設定の確認

`vercel.json` で以下が設定済み：
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- URLリライトルール（.html拡張子の省略）

## 4. 環境変数の設定（必要な場合）

Vercelダッシュボード → Settings → Environment Variables

将来的に必要になる可能性のある環境変数：
- `ANTHROPIC_API_KEY`: Claude API用
- `GOOGLE_ANALYTICS_ID`: アナリティクス用

## 5. カスタムドメインの設定（オプション）

1. Vercelダッシュボード → Settings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例: all-on-4.jp）
4. DNSレコードの設定指示に従う

## 6. 継続的デプロイ

GitHubのmainブランチへのプッシュで自動デプロイが実行されます。

```bash
# 更新をプッシュ
git add .
git commit -m "Update content"
git push
```

## 7. ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルドのテスト
npm run build
```

## トラブルシューティング

### ビルドエラーが発生する場合
1. `npm install` を実行して依存関係を確認
2. `node_modules` と `package-lock.json` を削除して再インストール
3. Vercelのビルドログを確認

### 404エラーが発生する場合
- `vercel.json` のrewritesルールを確認
- ファイルパスとリンクの整合性をチェック

### デプロイ後の確認事項
- [ ] トップページが正しく表示される
- [ ] CSSが適用されている
- [ ] 内部リンクが機能する
- [ ] Markdownから生成されたHTMLが表示される

## 参考リンク
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages vs Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [プロジェクトURL](https://all-on-4.vercel.app/)