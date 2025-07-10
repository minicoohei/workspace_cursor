---
marp: true
size: 16:9
paginate: true
backgroundColor: "var(--color-bg)"
theme: default

style: |
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap");
  :root {
    --color-bg:      #ffffff;
    --color-text:    #202020;
    --color-accent:  #E60033;
    --color-border:  #000000;
    --border-h: 40px;
    --pad-v: 8%;
    --pad-h: 10%;
    --fs-title: 60pt;
    --fs-h2:    48pt;
    --fs-body:  32pt;
    --fs-note:  20pt;
  }

  section {
    font-family: "Noto Sans JP", sans-serif;
    color: var(--color-text);
    background: var(--color-bg);
    padding: var(--pad-v) var(--pad-h);
  }

  .wide-frame { position: relative; }
  .wide-frame::before,
  .wide-frame::after  {
    content: "";
    position: absolute;
    left: 0; right: 0;
    height: var(--border-h);
    background: var(--color-border);
  }
  .wide-frame::before { top: 0; }
  .wide-frame::after  { bottom: 0; }

  h1, h2 { font-weight: 700; }
  h1 { font-size: var(--fs-title); }
  h2 { font-size: var(--fs-h2); }
  p, ul, ol { font-size: var(--fs-body); }

  .accent-line {
    display: inline-block;
    padding-bottom: 4px;
    border-bottom: 6px solid var(--color-accent);
  }

---

<!-- _class: lead wide-frame -->

# <span class="accent-line">{{タイトル}}</span>
## {{サブタイトル}}

**{{発表者}}**
*{{日付}}*

---

<!-- _class: wide-frame -->

## <span class="accent-line">Agenda</span>

1. **{{項目1}}**
2. **{{項目2}}**
3. **{{項目3}}**
4. **{{項目4}}**
5. **{{項目5}}**

---

<!-- _class: wide-frame -->

## <span class="accent-line">{{セクション見出し}}</span>

### {{サブ見出し}}
- **{{重要ポイント1}}**
- **{{重要ポイント2}}**
- **{{重要ポイント3}}**

### {{データ・数値}}
| 指標 | 値 | 備考 |
|------|-----|------|
| **{{指標1}}** | {{値1}} | {{備考1}} |
| **{{指標2}}** | {{値2}} | {{備考2}} |

---

<!-- _class: wide-frame -->

## <span class="accent-line">まとめ & Next Action</span>

### 🎯 重要な洞察
- **{{洞察1}}**
- **{{洞察2}}**
- **{{洞察3}}**

### 🚀 今すぐ始められること
1. **{{アクション1}}**
2. **{{アクション2}}**
3. **{{アクション3}}**

### 💡 {{メッセージ}}
{{最終メッセージ}}