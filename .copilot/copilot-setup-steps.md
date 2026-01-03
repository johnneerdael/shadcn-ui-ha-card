setup:
  - name: Install Dependencies
    run: npm install && go mod download
  - name: Build Tailwind
    run: make build-ui
  - name: Verify Environment
    run: make build
