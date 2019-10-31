# Expo + Firebase Example

ExpoとFirebaseで最低限仕様のアプリを作ってみたものです。インストールは一般的なExpoプロジェクトと同様です。  
Firebase周りの設定は`.env`を使用しています。`.env-example`を参考に設定してください。  
`.firebaserc`や`app.json`は適宜修正してください。  
その他下記のFirebase側の設定が必要です。

* Firebase Authenticationでメール/パスワードでのログインを有効化
* Firebase Cloud Functionをデプロイ（functionsディレクトリがあります）
* Firebase Databaseに`users`コレクションを追加し、以下のようにセキュリティルールを設定

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /history/{historyId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## アプリ概要

* 会員管理や出欠管理等に利用できることを想定
* ユーザーログイン後、QRコードを表示
* 他のユーザーのQRコードを読み取ることができ、読み取った履歴が双方の画面で閲覧できる
* アプリ起動の度にユーザーにトークンを発行し、それをQRコード化している
* トークンはいつでも更新可能
* 自分に対してタイトルや名前をセットできる。読み取られる側は例えば会議名やイベント名、読み取る側は自分の名前
* 履歴には双方のタイトル/名前と読み取られた/読み取った時間が表示される
* 履歴画面は無限スクロール+Pull-to-Refresh可能

# スクリーンショット

