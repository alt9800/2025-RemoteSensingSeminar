---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第六回 2025/08/01"

paginate: true

style: |
    section.title {
        justify-content: center;
        text-align: left;
    }
    .round-icon {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 400px;
      height: 400px;
      border-radius: 20%;
      object-fit: cover;
      z-index: 10;
    }
    .tiny-text {
    font-size: 0.6em;  /* 通常の60%サイズ */
    }
    img {
      max-width: 100%;
      height: auto;
      image-rendering: -webkit-optimize-contrast;
    }



---
# 衛星データ解析技術研究会<br>技術セミナー（応用編）
## Webアプリケーションの開発技術の習得

第六回 2025/08/01

担当講師 : 田中聡至

---

Dockerでやるか ローカルで環境を作るか

サーバーサイドのパッケージ管理について

どこにデプロイするか