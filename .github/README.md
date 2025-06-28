# GitHub Actions CI Setup for mubook-hon

このプロジェクトのGitHub Actions CI設定について説明します。

## CI構成

### Jobs

1. **typecheck**: TypeScriptの型チェック
2. **build**: Next.jsアプリケーションのビルド
3. **prebuild-for-playwright**: Playwrightテスト用のビルドアーティファクト作成
4. **playwright-tests**: Playwrightテストを並列実行（2シャード）
5. **merge-reports**: テスト結果をマージしてHTMLレポート生成

### 特徴

- **並列実行**: テストを2つのシャードに分割して並列実行
- **アーティファクト保存**: テスト結果、スクリーンショット、動画を保存
- **失敗時の詳細**: 失敗時にはスクリーンショットと動画が自動で保存される
- **HTMLレポート**: 全テスト結果を統合したHTMLレポートを生成

## 実行条件

- `main`, `playwright` ブランチへのpush
- 全ブランチへのPull Request

## レポートの確認方法

### CI実行中・実行後

1. GitHub ActionsのSummaryページでテスト結果の概要を確認
2. 失敗した場合は、Artifactsセクションから詳細レポートをダウンロード:
   - `playwright-html-report--attempt-X`: 統合HTMLレポート
   - スクリーンショット・動画も含む

### ローカルでのデバッグ

```bash
# 通常のテスト実行
npm run test:playwright:run

# CI環境のシミュレーション
CI=true npm run test:playwright:ci

# テスト結果の確認
npm run test:playwright:report
```

## カスタマイズ

### シャード数の調整

テスト数が増えた場合は、`.github/workflows/ci.yaml`の`matrix.shardIndex`と`matrix.shardTotal`を調整:

```yaml
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4]  # 4並列の場合
    shardTotal: [4]
```

### タイムアウトの調整

長時間実行されるテストがある場合は、`playwright.config.ts`のタイムアウト設定を調整:

```typescript
globalTimeout: process.env.CI ? 15 * 60 * 1000 : undefined, // 15分
timeout: process.env.CI ? 90 * 1000 : 30 * 1000, // 90秒
```
