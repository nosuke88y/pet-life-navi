// 記事本文（Markdown）から Q&A を抽出し、FAQPage JSON-LD 用の配列を返す。
// 期待する記法:
//   **Q. 質問文？**
//   A. 回答文...
// Q&A セクションが存在しない記事では空配列を返す（呼び出し側で未出力判定）。

export interface FaqItem {
  q: string;
  a: string;
}

export function extractFaq(body: string): FaqItem[] {
  const items: FaqItem[] = [];
  const lines = body.split('\n');

  let currentQ: string | null = null;
  let currentA: string[] = [];

  const flush = () => {
    if (currentQ && currentA.length) {
      const answer = currentA.join(' ').replace(/\s+/g, ' ').trim();
      if (answer) items.push({ q: currentQ, a: answer });
    }
    currentQ = null;
    currentA = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    // 質問行（見出し形式）: ### Q. xxx  または  #### Q. xxx
    const qHeadingMatch = line.match(/^#{3,6}\s+Q[.．]\s*(.+?)\s*$/);
    // 質問行（太字形式）: **Q. xxx?**
    const qBoldMatch = line.match(/^\*\*Q[.．]\s*(.+?)\*\*\s*$/);

    if (qHeadingMatch || qBoldMatch) {
      flush();
      currentQ = ((qHeadingMatch && qHeadingMatch[1]) || (qBoldMatch && qBoldMatch[1]) || '').trim();
      continue;
    }

    // Q でない見出しは Q&A ブロック境界として扱う
    if (/^#{1,6}\s/.test(line)) {
      flush();
      continue;
    }

    // 回答行: A. xxx
    const aMatch = line.match(/^A[.．]\s*(.+)$/);
    if (aMatch && currentQ) {
      currentA.push(aMatch[1].trim());
      continue;
    }

    // 回答の続き（A. の次行以降の本文）
    if (currentQ && currentA.length > 0 && line.length > 0) {
      currentA.push(line);
    }
  }
  flush();

  return items;
}
