#!/usr/bin/env bash
# Docker イメージのスモークテスト。
# build:image 後に実行し、HTTP レスポンスと DB 連携が期待通りに動作するか検証する。
#
# 使い方:
#   ./smoke-test.sh          # ビルド済みの rwts-web イメージを使ってテスト
#   ./smoke-test.sh --build  # docker build から実行する

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

IMAGE_NAME="rwts-web"
CONTAINER_NAME="rwts-web-smoke"
HOST_PORT=3001
BASE_URL="http://localhost:${HOST_PORT}"
READY_TIMEOUT_SECONDS=30

PASS_COUNT=0
FAIL_COUNT=0
STARTED_CONTAINER=false

# ── 出力ヘルパー ──────────────────────────────────────────────────────────────

GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
RESET="\033[0m"

log_pass() { echo -e "  ${GREEN}✓${RESET} $1"; PASS_COUNT=$((PASS_COUNT + 1)); }
log_fail() { echo -e "  ${RED}✗${RESET} $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
log_info() { echo -e "  ${YELLOW}→${RESET} $1"; }
log_section() { echo; echo "── $1 ──"; }

# ── クリーンアップ（EXIT トラップで必ず実行）────────────────────────────────

cleanup() {
  if [ "${STARTED_CONTAINER}" = "true" ]; then
    log_info "コンテナを停止・削除しています..."
    docker stop "${CONTAINER_NAME}" > /dev/null 2>&1 || true
    docker rm   "${CONTAINER_NAME}" > /dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

# ── アサーション関数 ─────────────────────────────────────────────────────────

# 期待する HTTP ステータスコードが返るか検証する
# 引数: <説明> <期待コード> <実際のコード>
assert_status() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  if [ "${actual}" = "${expected}" ]; then
    log_pass "${label}: HTTP ${actual}"
  else
    log_fail "${label}: HTTP ${actual} (期待値: ${expected})"
  fi
}

# レスポンスボディに指定文字列が含まれるか検証する
# 引数: <説明> <期待する文字列> <実際のボディ>
assert_contains() {
  local label="$1"
  local expected="$2"
  local body="$3"
  if echo "${body}" | grep -qF "${expected}"; then
    log_pass "${label}: \"${expected}\" を含む"
  else
    log_fail "${label}: \"${expected}\" が見つからない (ボディ: ${body:0:120})"
  fi
}

# Content-Type ヘッダーを検証する
# 引数: <説明> <期待する Content-Type> <URL>
assert_content_type() {
  local label="$1"
  local expected="$2"
  local url="$3"
  local ct
  ct=$(curl -s -o /dev/null -w "%{content_type}" "${url}")
  if echo "${ct}" | grep -qF "${expected}"; then
    log_pass "${label}: Content-Type ${ct}"
  else
    log_fail "${label}: Content-Type ${ct} (期待値: ${expected})"
  fi
}

# ── 起動確認 ─────────────────────────────────────────────────────────────────

wait_for_server() {
  log_info "サーバーの起動を待機しています (最大 ${READY_TIMEOUT_SECONDS}s)..."
  local elapsed=0
  until curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/" | grep -q "200"; do
    if [ "${elapsed}" -ge "${READY_TIMEOUT_SECONDS}" ]; then
      echo -e "${RED}サーバーが ${READY_TIMEOUT_SECONDS}s 以内に起動しませんでした${RESET}"
      exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  log_info "サーバーが起動しました (${elapsed}s)"
}

# ── メイン処理 ────────────────────────────────────────────────────────────────

BUILD=false
for arg in "$@"; do
  if [ "${arg}" = "--build" ]; then
    BUILD=true
  fi
done

echo "===== Docker スモークテスト: ${IMAGE_NAME} ====="

if [ "${BUILD}" = "true" ]; then
  log_section "Docker イメージのビルド"
  log_info "pnpm run build:image を実行しています..."
  (cd "${REPO_ROOT}" && pnpm run build:image)
  log_info "ビルド完了"
fi

# 既存コンテナが残っていれば削除
docker stop "${CONTAINER_NAME}" > /dev/null 2>&1 || true
docker rm   "${CONTAINER_NAME}" > /dev/null 2>&1 || true

log_section "コンテナの起動"
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${HOST_PORT}:3000" \
  "${IMAGE_NAME}" > /dev/null
STARTED_CONTAINER=true

wait_for_server

# ── テスト ────────────────────────────────────────────────────────────────────

log_section "HTMLページ（SSRレンダリング確認）"

for path in "/" "/shop/bag" "/shop/buy/macbook-pro-16" "/shop/checkout"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  assert_status "GET ${path}" "200" "${status}"
done

body_top=$(curl -s "${BASE_URL}/")
assert_contains "/ に <!DOCTYPE html> が含まれる" "<!DOCTYPE html>" "${body_top}"
assert_contains "/ に商品リストが含まれる" "MacBook Pro 16" "${body_top}"

log_section "静的アセット"

assert_status "GET /static/style.css" "200" "$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/static/style.css")"
assert_status "GET /static/client.js"  "200" "$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/static/client.js")"
assert_content_type "/static/style.css は text/css" "text/css" "${BASE_URL}/static/style.css"
assert_content_type "/static/client.js は application/javascript" "javascript" "${BASE_URL}/static/client.js"

log_section "API（DB 連携確認）"

products_body=$(curl -s "${BASE_URL}/api/products")
assert_status "GET /api/products" "200" "$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/products")"
assert_contains "/api/products にシード商品が含まれる" "macbook-pro-16" "${products_body}"

product_count=$(echo "${products_body}" | grep -o '"productId"' | wc -l | tr -d ' ')
if [ "${product_count}" = "4" ]; then
  log_pass "/api/products が商品4件を返す"
else
  log_fail "/api/products が商品4件を返さない (実際: ${product_count}件)"
fi

spec_body=$(curl -s "${BASE_URL}/api/product/macbook-pro-16/spec")
assert_status "GET /api/product/macbook-pro-16/spec" "200" "$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/product/macbook-pro-16/spec")"
assert_contains "/api/product/macbook-pro-16/spec に商品名が含まれる" "MacBook" "${spec_body}"

log_section "バッグ API"

bag_body=$(curl -s "${BASE_URL}/api/show/bag")
assert_status "GET /api/show/bag" "200" "$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/show/bag")"
assert_contains "/api/show/bag に items キーが含まれる" '"items"' "${bag_body}"

log_section "購入フロー（追加 → 決済）"

# 前のテストでバッグに商品が入っている場合があるため、先にクリアする（空なら 422 を無視する）
curl -s -o /dev/null -X POST "${BASE_URL}/api/checkout" || true

add_status=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "${BASE_URL}/api/add/bag" \
  -H "Content-Type: application/json" \
  -d '{"product":{"productId":"macbook-pro-16","specs":{}},"count":1}')
assert_status "POST /api/add/bag（商品追加）" "201" "${add_status}"

bag_after_add=$(curl -s "${BASE_URL}/api/show/bag")
assert_contains "バッグに追加した商品が含まれる" "macbook-pro-16" "${bag_after_add}"

checkout_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/api/checkout")
assert_status "POST /api/checkout（決済）" "200" "${checkout_status}"

bag_after_checkout=$(curl -s "${BASE_URL}/api/show/bag")
assert_contains "決済後にバッグが空になる" '"items":[]' "${bag_after_checkout}"

log_section "エラーレスポンス確認"

empty_checkout_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/api/checkout")
assert_status "POST /api/checkout（空バッグ）は 422 を返す" "422" "${empty_checkout_status}"

not_found_status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/product/nonexistent-product/spec")
assert_status "GET /api/product/nonexistent/spec は 404 を返す" "404" "${not_found_status}"

# ── 結果サマリー ─────────────────────────────────────────────────────────────

echo
echo "========================================="
echo -e "  結果: ${GREEN}${PASS_COUNT} 件合格${RESET} / ${RED}${FAIL_COUNT} 件失敗${RESET}"
echo "========================================="

if [ "${FAIL_COUNT}" -gt 0 ]; then
  exit 1
fi
