import http from 'k6/http';
import { check, sleep } from 'k6';

// ───── reporting needs ─────
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
// ─────────────────────────────────────────────────────

export const options = {
  vus: 20,
  duration: '10m',          // or 2m, 5m, whatever you want
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.1'],
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'status is 200':       (r) => r.status === 200,
    'page contains k6':    (r) => r.body.includes('k6'),
  });
  sleep(1);
}

// ───── AUTOMATIC REPORT GENERATION (no env vars ever again) ─────
export function handleSummary(data) {
  return {
    'report.html': htmlReport(data, { title: 'My Awesome Load Test' }),
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
  };
}