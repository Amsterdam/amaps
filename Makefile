.PHONY: manifests build push app dev bash test requirements

dc = docker compose
run = $(dc) run --rm

build:
	$(dc) build

push: build
	$(dc) push

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

requirements:  ## Upgrade dependencies
	$(run) upgrade $(ARGS)

test:
	@echo "Skipping test (temporarily disabled)"