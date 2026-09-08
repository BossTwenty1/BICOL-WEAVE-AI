# Guidance for Coding Agents

- Preserve the current simple frontend-to-FastAPI-to-model architecture.
- Do not introduce unnecessary frameworks or infrastructure.
- Do not change the model class order (`plain`, `twill`, `complex`) without explicit instruction.
- Never commit datasets or trained model weights.
- Never fabricate evaluation metrics or research results.
- Make incremental, focused changes.
- Verify existing files and the current architecture before modifying them.
