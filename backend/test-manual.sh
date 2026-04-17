#!/usr/bin/env bash
BASE="http://localhost:3000/api"
PASS=0
FAIL=0

check() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$actual" = "$expected" ]; then
    echo "PASS [$actual] $desc"
    ((PASS++))
  else
    echo "FAIL [expected $expected, got $actual] $desc"
    ((FAIL++))
  fi
}

# 1. Health check
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")
check "GET /api/health" "200" "$status"

# 2. Login con credenziali valide
response=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.rossi@test.it","password":"Test1234!"}')
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.rossi@test.it","password":"Test1234!"}')
TOKEN=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
check "POST /api/auth/login credenziali valide" "200" "$status"

# 3. Login con email inesistente
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexist@test.it","password":"Test1234!"}')
check "POST /api/auth/login email inesistente" "401" "$status"

# 4. Login con password sbagliata
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.rossi@test.it","password":"Sbagliata!"}')
check "POST /api/auth/login password sbagliata" "401" "$status"

# 5. GET /api/users/me senza token
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/users/me")
check "GET /api/users/me senza token" "401" "$status"

# 6. GET /api/users/me con token valido
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/users/me" \
  -H "Authorization: Bearer $TOKEN")
check "GET /api/users/me con token valido" "200" "$status"

echo ""
echo "Risultato: $PASS PASS, $FAIL FAIL"
