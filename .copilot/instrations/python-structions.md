# Python Development Standards
Used primarily for data processing, scripting, and the Ruby-adjacent client tools.

## Requirements
* **Typing:** Use type hints (`def process(data: dict) -> None:`) for all new functions.
* **Environment:** Use `poetry` or `requirements.txt` as defined in the `python/` directory.
* **Style:** Follow PEP 8 standards. Run `black .` before committing.
* **Testing:** Use `pytest`. All new ingestion scripts require 80%+ coverage.
