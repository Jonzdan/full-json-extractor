# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/)
and the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

--- 

## [1.0.4] - 2026-02-09

### Added
- Changelog
- Github Repostiory Link

### Changed
- Removed dependencies and reduced memory by switching to nested loops

[Commit](https://github.com/Jonzdan/full-json-extractor/commit/522fa1d2bb7c0f48a81f279951a2e1518c152f83)

---

## [1.0.3] - 2026-02-08

### Added
- .npmignore

[Commit](https://github.com/Jonzdan/full-json-extractor/commit/046995a2dc11de38f0ef7ea679db23d7bf550b1d)

---

## [1.0.2] - 2026-02-08

### Added
- Benchmarks to readme
- Caller generics

### Changed
- Switched from two-array queue implementation to denque for performance improvements
- Added memory pruning for internal memoization map, significantly reducing OOM likelihood

[Commit](https://github.com/Jonzdan/full-json-extractor/commit/188ecfb584e1da895f0302fb14017013cd8f5c82)

---

## [1.0.1] - 2025-08-18

### Changed
-  Removed dead code for JSON candidate mapping

[Commit](https://github.com/Jonzdan/full-json-extractor/commit/03c60c1d632dc8c5376896963980466ae2db81bc)

---

## [1.0.0] - 2025-08-17

### Added
- Initial release
- Core JSON extraction functionality

[Commit](https://github.com/Jonzdan/full-json-extractor/commit/96893aa0ed77e5610ccabce20b699701980a27a9)
