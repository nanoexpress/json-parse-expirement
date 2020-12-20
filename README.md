# expirements

## How to Run

```bash
yarn
node index.js
```

## Results

This result on iMac 5K Late 2014 i7-4790K

```bash
expirements on  master [✘!?] is 📦 v1.0.0 via ⬢ v15.4.0 took 11s
❯ node index.js
JSON buffer size 0.487 Kb
Benchmark started...
Benchmark done
┌─────────┬──────────────────────────────┬────────────┐
│ (index) │             name             │ time taken │
├─────────┼──────────────────────────────┼────────────┤
│    0    │         'JSON.parse'         │  '496ms'   │
│    1    │ '@dalisoft/turbo-json-parse' │  '235ms'   │
│    2    │       'simdJson.parse'       │  '1815ms'  │
│    3    │     'simdJson.lazyParse'     │  '4622ms'  │
│    4    │         'fast-json'          │  '3513ms'  │
└─────────┴──────────────────────────────┴────────────┘
```

## License

MIT
