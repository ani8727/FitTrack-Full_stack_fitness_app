#!/bin/sh
set -e

CONFIG_URL="http://configserver:8888/actuator/health"
EUREKA_URL="http://eureka:8761/actuator/health"
MAX_RETRIES=30
SLEEP_SECONDS=2

echo "Waiting for ConfigServer at $CONFIG_URL and Eureka at $EUREKA_URL"
count=0
until [ $count -ge $MAX_RETRIES ]; do
  ok=0
  if curl -fsS "$CONFIG_URL" >/dev/null 2>&1; then
    echo "ConfigServer is healthy"
    ok=$((ok+1))
  else
    echo "ConfigServer not ready yet"
  fi
  if curl -fsS "$EUREKA_URL" >/dev/null 2>&1; then
    echo "Eureka is healthy"
    ok=$((ok+1))
  else
    echo "Eureka not ready yet"
  fi
  if [ "$ok" -eq 2 ]; then
    echo "All dependent services are healthy"
    exec java -jar /app/app.jar
    exit 0
  fi
  count=$((count+1))
  sleep $SLEEP_SECONDS
done

echo "Timeout waiting for services - starting gateway anyway"
exec java -jar /app/app.jar
