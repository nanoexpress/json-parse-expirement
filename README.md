# json-parse

## Installation

```bash
yarn
```

## How to Run

### String

```bash
yarn string-bench # Parse from String
```

### Buffer

```bash
yarn buffer-bench # Parse from String
```

## Results

This result on Macbook Pro M1

```bash
json-performance on  master [✘!?] is 📦 v1.0.0 via ⬢ v16.1.0 took 4s
❯ yarn string-bench
yarn run v1.22.10
$ node string-parse.js
JSON buffer size 0.491 Kb
Benchmark started...
Benchmark done
┌─────────┬──────────────────────────────┬────────────┐
│ (index) │             name             │ time taken │
├─────────┼──────────────────────────────┼────────────┤
│    0    │         'JSON.parse'         │  '311ms'   │
│    1    │ '@dalisoft/turbo-json-parse' │  '223ms'   │
│    2    │            'avsc'            │  '405ms'   │
│    3    │       'simdJson.parse'       │  '1194ms'  │
│    4    │     'simdJson.lazyParse'     │  '2386ms'  │
│    5    │         'fast-json'          │  '2820ms'  │
└─────────┴──────────────────────────────┴────────────┘
✨  Done in 8.15s.
```

## License

MIT
