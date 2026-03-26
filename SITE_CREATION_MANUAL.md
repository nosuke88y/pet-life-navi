# ニッチSEOアフィリエイトサイト作成マニュアル

pet-life-navi の構築経験をもとに体系化した手順書です。
同様のニッチSEOアフィリエイトサイトを再現できることを目的としています。

---

## 1. 事前準備

### 1-1. ドメイン取得（お名前.com）

1. [お名前.com](https://www.onamae.com/) にアクセスしてアカウント作成
2. 取得したいドメイン名を検索（例: `pet-life-navi.com`）
3. `.com` や `.net` など希望の TLD を選択して購入
4. 自動更新設定を確認する

> **ドメイン名の選び方**
> - ジャンルが伝わる英単語を組み合わせる
> - 短く覚えやすい名前にする
> - ハイフン区切りは最大1〜2箇所まで

### 1-2. A8.net 登録

1. [A8.net](https://www.a8.net/) にアクセスしてメディア（サイト運営者）として登録
2. サイト審査に通過する必要があるため、**先にサイトを公開してから登録**
3. 登録後、ジャンルに合ったアフィリエイト案件を検索して提携申請

> **提携申請のコツ**
> - サイトの記事数が10本以上あると審査が通りやすい
> - 案件のランディングページと記事のテーマを一致させる

### 1-3. GitHub・Vercel アカウント作成

1. [GitHub](https://github.com/) でアカウント作成 → 新規リポジトリを作成（Public 推奨）
2. [Vercel](https://vercel.com/) でアカウント作成 → GitHub アカウントと連携

---

## 2. サイト構築手順

### 2-1. Astro プロジェクトのセットアップ

```bash
# Astroプロジェクトを新規作成
npm create astro@latest my-site

# プロジェクトに移動
cd my-site

# 依存関係をインストール
npm install
```

セットアップ時の選択肢：
- テンプレート：「Empty」を選択
- TypeScript：「Yes」を選択

### 2-2. Tailwind CSS 導入

```bash
# Tailwind CSS と typography プラグインを追加
npx astro add tailwind
npm install @tailwindcss/typography
```

`astro.config.mjs` の確認：

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

`tailwind.config.mjs`：

```js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
```

### 2-3. ディレクトリ構成

```
src/
├── content.config.ts        ← コレクション定義（Astro v5/v6）
├── content/
│   ├── dog/                 ← 犬カテゴリの記事（.md）
│   └── cat/                 ← 猫カテゴリの記事（.md）
├── layouts/
│   ├── BaseLayout.astro     ← <html>・<head>・ナビゲーション
│   └── ArticleLayout.astro  ← 記事ページのレイアウト
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── ArticleCard.astro
│   └── AffiliateBox.astro   ← アフィリエイトボックス
├── pages/
│   ├── index.astro
│   ├── dog/index.astro
│   ├── dog/[...slug].astro
│   ├── cat/index.astro
│   ├── cat/[...slug].astro
│   ├── profile.astro
│   └── disclaimer.astro
└── styles/global.css
```

### 2-4. Content Collections の設定

`src/content.config.ts`：

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()),
});

const dog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dog' }),
  schema: articleSchema,
});

const cat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cat' }),
  schema: articleSchema,
});

export const collections = { dog, cat };
```

> **注意（Astro v5/v6）**
> - config ファイルは `src/content.config.ts`（`src/content/config.ts` は旧形式でエラー）
> - 記事の slug は `post.slug` ではなく `post.id` を使う

### 2-5. 記事テンプレート（frontmatter）

```markdown
---
title: "記事タイトルをここに書く"
description: "120〜150文字程度の記事概要。検索結果のスニペットとして表示される。"
date: 2026-01-01
tags: ["タグ1", "タグ2", "タグ3"]
---

本文をここに書く。
```

---

## 3. 記事量産手順

### 3-1. キーワードリストの作成

1. ターゲットジャンルで検索需要のあるキーワードを列挙
2. 以下の形式で CSV ファイルを作成：

```csv
keyword,category,slug
犬の腎臓病に良いフード,dog,dog-food-for-kidney-disease
猫の毛玉ケアフード,cat,cat-food-for-hairball
```

### 3-2. Claude を使った記事生成

Claude（claude.ai）に以下のプロンプトで記事を生成：

```
以下のキーワードでSEO記事を書いてください。

キーワード：「犬の腎臓病に良いフード」
文字数：2000〜2500文字
形式：Markdownのfrontmatterあり
frontmatterフォーマット：
  title: string
  description: string（120〜150文字）
  date: 2026-01-01
  tags: [string]

記事の構成：
- リード文（問題提起）
- ## 見出し × 3〜5個
- ### 小見出し × 各2〜3個
- まとめ
```

### 3-3. 記事ファイルの追加

生成した Markdown を `src/content/dog/` または `src/content/cat/` に保存する。

ファイル名の命名規則：
- 英小文字・ハイフン区切り（例: `dog-food-for-kidney-disease.md`）
- URL と一致させる

### 3-4. 重複記事の確認・整理

記事数が増えてきたら定期的に重複チェックを行う。

**確認方法：** Claude Code に以下を依頼

```
src/content/dog/ の記事で内容が重複しているファイルを
確認して一覧を出してください。削除すべき重複記事を教えてください。
```

**判断基準：**
- 同じテーマ・キーワードを扱っている記事
- タイトルの表現が違うだけで本文内容がほぼ同じ記事
- 重複する場合は、より詳細・具体的な方を残す

### 3-5. GitHub へのコミット・push

```bash
git add -A
git commit -m "記事追加: ○○に関する記事5本"
git push
```

Vercel と GitHub を連携済みであれば、push するだけで自動デプロイされる。

---

## 4. 公開手順

### 4-1. GitHub へのアップロード（初回）

```bash
# ローカルで git 初期化
git init
git add -A
git commit -m "初回コミット"

# GitHub リポジトリと紐付け
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git branch -M master
git push -u origin master
```

### 4-2. Vercel でのデプロイ

1. [Vercel](https://vercel.com/) にログイン
2. 「Add New Project」→ GitHub リポジトリを選択
3. フレームワークプリセット：「Astro」を選択
4. 「Deploy」ボタンをクリック
5. ビルドが完了すると `xxx.vercel.app` の URL でアクセスできる

> **注意：Vercel CLI について**
> 日本語ユーザー名の Windows 環境では Vercel CLI がエラーになることがある。
> その場合はブラウザ経由（vercel.com）で設定する。

### 4-3. 独自ドメインの紐付け

#### Vercel 側の設定

1. Vercel のプロジェクトページ → 「Settings」→「Domains」
2. 取得したドメイン（例: `pet-life-navi.com`）を追加
3. Vercel が指示する DNS レコードを確認・メモする

#### お名前.com 側の設定

「ネームサーバー設定」→「DNS レコード設定」から以下を追加：

| ホスト名 | タイプ | 値 |
|---------|--------|-----|
| `@` | A レコード | `76.76.21.21`（Vercel の IP） |
| `www` | CNAME | `cname.vercel-dns.com` |

> DNS の反映には最大 24〜48 時間かかることがある。

### 4-4. Google サーチコンソール登録

1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. 「プロパティを追加」→ドメインを入力
3. 所有権の確認：HTML タグを `<head>` に追加する方法が簡単

`src/layouts/BaseLayout.astro` の `<head>` 内に追加：

```html
<meta name="google-site-verification" content="xxxxxxxxxxxxxxxx" />
```

4. 確認後、「サイトマップ」→ `sitemap-index.xml` を送信

> Astro はデフォルトでサイトマップを生成しない。以下で追加できる：
> ```bash
> npx astro add sitemap
> ```
> `astro.config.mjs` に `site: 'https://your-domain.com'` を追記する。

---

## 5. マネタイズ設定

### 5-1. A8.net での提携申請

1. A8.net にログイン → 「プログラム検索」でジャンルのキーワードを入力
2. 案件一覧から関連性の高い案件を選んで「提携申請」
3. 審査通過後（即日〜1週間）に広告タグが取得できる

**提携申請のポイント：**
- 記事内容と案件のジャンルを一致させる
- サイトに十分なコンテンツ（記事10本以上）があるとよい
- 審査落ちしても再申請可能

### 5-2. アフィリエイトリンクの取得

1. 提携済み案件の「広告リンク」→「テキスト広告」を選択
2. 以下の形式の HTML が生成される：

```html
<a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow">商品名</a>
<img border="0" width="1" height="1" src="https://wwwXX.a8.net/0.gif?a8mat=XXXXX" alt="">
```

- `<a>` タグ：クリックリンク（ユーザーに見える）
- `<img>` タグ：1×1px のトラッキングピクセル（非表示・必須）

### 5-3. アフィリエイトボックスの実装

Markdown 内に直接 HTML を書くと Astro の Markdown 処理で余白が乱れるため、
**Astro コンポーネント方式**で実装する。

#### AffiliateBox.astro の構成

```astro
---
interface Link {
  href: string;
  text: string;
  img: string;
}
interface Props {
  type: 'dog' | 'cat'; // カテゴリに応じて切り替え
}
const { type } = Astro.props;

const dogLinks: Link[] = [
  {
    href: 'https://px.a8.net/svt/ejp?a8mat=XXXXX',
    text: '商品名',
    img: 'https://wwwXX.a8.net/0.gif?a8mat=XXXXX',
  },
  // ...
];
const catLinks: Link[] = [ /* 同様 */ ];
const links = type === 'dog' ? dogLinks : catLinks;
---

<div class="affiliate-box">
  <p class="affiliate-title">🐾 おすすめ商品</p>
  {links.map(link => (
    <div class="affiliate-item">
      <a href={link.href} rel="nofollow">{link.text}</a>
      <img border="0" width="1" height="1" src={link.img} alt="" />
    </div>
  ))}
</div>

<style>
  .affiliate-box {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: 12px;
    margin: 16px 0;
    border-radius: 6px;
  }
  .affiliate-title {
    font-weight: bold;
    margin: 0 0 8px 0;
  }
  .affiliate-item {
    margin: 0;
    padding: 6px 0;
    line-height: 1.5;
    border-top: 1px solid #e5e5e5;
  }
  .affiliate-item:first-of-type { border-top: none; }
  .affiliate-item a {
    color: #059669;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.15s;
  }
  .affiliate-item a:hover { color: #047857; }
</style>
```

#### ArticleLayout.astro への組み込み

```astro
---
import AffiliateBox from '../components/AffiliateBox.astro';
// ...
const { title, description, date, tags, category } = Astro.props;
---

<!-- 本文前 -->
<AffiliateBox type={category} />

<article>
  <slot />
</article>

<!-- 本文後 -->
<AffiliateBox type={category} />
```

#### 新しい案件を追加する方法

`AffiliateBox.astro` の `dogLinks` または `catLinks` 配列に追記するだけ：

```ts
{
  href: 'https://px.a8.net/svt/ejp?a8mat=新しいID',
  text: '新しい商品名',
  img: 'https://wwwXX.a8.net/0.gif?a8mat=新しいID',
},
```

push するだけで全記事に自動反映される。

---

## 付録：よくあるトラブル

| トラブル | 原因 | 対処法 |
|---------|------|--------|
| ビルドエラー（content config） | `src/content/config.ts` を使っている | `src/content.config.ts` に移動する |
| 記事が表示されない | `post.slug` を使っている | `post.id` に変更する |
| Vercel CLI エラー | 日本語ユーザー名の環境 | ブラウザからVercelを操作する |
| DNS が反映されない | 設定直後 | 最大48時間待つ |
| アフィリエイトリンクで余白が乱れる | MarkdownにHTMLを直書き | Astroコンポーネント方式に変更する |
| imgタグのURLが間違っている | 手入力ミス | 書き込み後に必ずファイルを目視確認する |

---

*作成日：2026年3月26日*
*ベースプロジェクト：pet-life-navi（https://github.com/nosuke88y/pet-life-navi）*
