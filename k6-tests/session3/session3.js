// session3.js – Automatic HTML Report Generation (No Manual Steps)
import http from 'k6/http';
import { check, sleep } from 'k6';

// Import the stable HTML reporter (official community extension, works in all envs)
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// Optional: For console summary too (keeps the default output)
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  vus: 20,    // 20 virtual users
  duration: '1m',  // 10 minutes (use '2m' for quick tests)
  thresholds: {
    http_req_duration: ['p(95)<500'],    // 95th percentile < 500 ms
    http_req_failed: ['rate<0.1'],       // Error rate < 10%
  },
};

export default function () {
  const res = http.get('https://test.k6.io');  // Public test endpoint
  check(res, {
    'status is 200': (r) => r.status === 200,
    'page contains k6': (r) => r.body.includes('k6'),
  });
  sleep(1);  // 1 second think time
}

// Automatic report generation at test end (shift-left magic)
export function handleSummary(data) {
  return {
    'session3-report.html': htmlReport(data, { 
      title: 'k6 Load Test - Session 3',
      subtitle: '20 VUs @ test.k6.io for 10m | Shift-Left Perf Check'
    }),  // Beautiful HTML with tabs/charts (auto-generated)
    stdout: textSummary(data, { indent: '  ', enableColors: true }),  // Pretty console output too
  };
}