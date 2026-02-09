SHELL := /bin/bash

.PHONY: bootstrap pods clean build beta help

help:
	@echo "Available targets:"
	@echo "  bootstrap  - Install Ruby dependencies and CocoaPods"
	@echo "  pods       - Install/update CocoaPods dependencies"
	@echo "  clean      - Clean Pods and workspace"
	@echo "  build      - Build iOS app for App Store"
	@echo "  beta       - Build and upload to TestFlight"

bootstrap:
	bundle install --path vendor/bundle
	cd ios && bundle exec pod install

pods:
	cd ios && bundle exec pod install

clean:
	rm -rf ios/Pods ios/NossaMaternidade.xcworkspace Podfile.lock
	rm -rf ios/build

build:
	cd ios && bundle exec fastlane ios build

beta:
	cd ios && bundle exec fastlane ios beta
