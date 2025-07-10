---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第四回 2025/07/18"

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

第四回 2025/07/18

担当講師 : 田中聡至

---
## 今回扱う


---

## 原始的に、セッションはどのように管理されていたか (Apacheとサーブレットを例に)
## サーバーサイドで管理する仕組み

ユーザー情報をサーバー側でDBなどで保存しておいて、エージェントなどの識別を行う

---

認証情報を毎回ヘッダーに載せる方法


---



BASIC認証とは

---

# クライアント側に情報を持たせて通信しよう
JWTとは (この講義では基本的にはこれを利用してアプリを組んでいく)


---

補足
2FAとは


---

補足
OAuth認証とは

---

実際にログインユーザごと表示されるものが変わる例
ならびに
ログインユーザでないとデータが表示されない例

---

画像(マルチメディアファイル)のアップロードをどうするか

---


三層アーキテクチャとWebサーバの存在

---