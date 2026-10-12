// Isolated fflate entry avoids importing the main renderer vendor into this worker.
// Synchronous inflation occurs only inside this disposable worker, never on UI.
import { gunzipSync } from 'fflate';
self.onmessage = ({ data }) => {
  try {
    if (!(data?.bytes instanceof ArrayBuffer)) throw new TypeError('Expected compressed model bytes');
    const bytes = gunzipSync(new Uint8Array(data.bytes));
    const output = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes : bytes.slice();
    self.postMessage({ bytes: output.buffer }, [output.buffer]);
  } catch (error) {
    self.postMessage({ error: error?.message || 'Invalid gzip model' });
  }
};
