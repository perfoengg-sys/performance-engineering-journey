import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  http.get('https://httpbin.org/get');
  sleep(1); // think time of 1 second
}
