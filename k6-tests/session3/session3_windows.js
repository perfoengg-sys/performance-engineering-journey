// session3.js – Basic k6 Load Test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,    // 20 virtual users
  duration: '2m',  // 2 minutes (enough for graphs; change to 10m for full run)
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