// session3.js – Automatic HTML Report with Graphs (No Dashboard Needed)
import http from 'k6/http';
import { check, sleep } from 'k6';

// Import the official community HTML reporter (includes graphs & tables)
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// For console summary too (optional, but nice for quick checks)
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  vus: 20,    // 20 virtual users
  duration: '10m',  // 10 minutes (use '2m' for quick tests – graphs need ~30s+ data)
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

// Automatic end-of-test report generation (graphs + tables)
export function handleSummary(data) {
  return {
    'session3-report.html': htmlReport(data, { 
      title: 'k6 Load Test Report - Session 3',
      subtitle: '20 VUs testing https://test.k6.io | p95 <500ms Threshold'
    }),  // HTML with graphs/tabs
    stdout: textSummary(data, { indent: '  ', enableColors: true }),  // Colored console summary
  };
}