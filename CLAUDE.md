# CLAUDE.md - All-on-4情報サイト構築方針

## 目的
All-on-4を検討するユーザーに対し、治療知識・費用・病院レビュー・Q&Aを包括的に提供する静的Webサイトを構築する。

## 技術構成
- GitHub Pages による静的ホスティング
- Markdownベースのコンテンツ管理（CMS不要）
- Claude Codeで記事・レビュー・FAQ生成＆GitHub連携更新
- data/ ディレクトリに構造化YAML形式の病院データを格納

## コンテンツ構成（仮）
- index.html（トップ）
- faq/index.md
- hospitals/{地域}.md
- reviews/{病院ID}.md
- columns/{slug}.md
- data/hospitals.yaml
- claude/prompts.md
- .github/workflows/update.yaml