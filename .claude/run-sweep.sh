#!/bin/bash
# Usage: ./run-sweep.sh <prompt-file>
# Runs a focused sweep and logs token usage to reports/usage-log.json

PROMPT_FILE="$1"
if [ -z "$PROMPT_FILE" ]; then
  echo "Usage: $0 <prompt-file>"
  exit 1
fi

SWEEP_NAME=$(basename "$PROMPT_FILE" .md)
RUN_DATE=$(date +%Y-%m-%d)
RUN_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "Running sweep: $SWEEP_NAME"

RESULT=$(claude --dangerously-skip-permissions --output-format json -p "$(cat "$PROMPT_FILE")" 2>&1)
EXIT_CODE=$?

# Extract token counts
INPUT_TOKENS=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('usage',{}).get('input_tokens',0)+d.get('usage',{}).get('cache_read_input_tokens',0)+d.get('usage',{}).get('cache_creation_input_tokens',0))" 2>/dev/null || echo "unknown")
OUTPUT_TOKENS=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('usage',{}).get('output_tokens',0))" 2>/dev/null || echo "unknown")
TOTAL_COST=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('total_cost_usd','unknown'))" 2>/dev/null || echo "unknown")

echo "Done. Input tokens: $INPUT_TOKENS | Output tokens: $OUTPUT_TOKENS | Cost: \$$TOTAL_COST"

# Append to usage log
USAGE_LOG="reports/usage-log.json"
if [ ! -f "$USAGE_LOG" ]; then
  echo "[]" > "$USAGE_LOG"
fi

python3 - <<PYEOF
import json, os
log_path = "$USAGE_LOG"
with open(log_path) as f:
    log = json.load(f)
log.append({
    "date": "$RUN_DATE",
    "ts": "$RUN_TS",
    "sweep": "$SWEEP_NAME",
    "input_tokens": "$INPUT_TOKENS",
    "output_tokens": "$OUTPUT_TOKENS",
    "cost_usd": "$TOTAL_COST",
    "exit_code": $EXIT_CODE
})
with open(log_path, "w") as f:
    json.dump(log, f, indent=2)
print(f"Logged to {log_path}")
PYEOF

exit $EXIT_CODE
